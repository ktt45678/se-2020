const { BlobServiceClient, ContainerSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } = require('@azure/storage-blob');
const intoStream = require('into-stream');

exports.token = (container, nanoId, fileName, expiry) => {
  const fullName = `${nanoId}/${fileName}`;
  const startDate = new Date();
  startDate.setSeconds(startDate.getSeconds() - 300);
  const expiryDate = new Date();
  expiryDate.setSeconds(expiryDate.getSeconds() + expiry);
  const permissions = ContainerSASPermissions.parse('r');
  const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
  const sasToken = generateBlobSASQueryParameters({
    containerName: container,
    blobName: fullName,
    permissions: permissions,
    startsOn: startDate,
    expiresOn: expiryDate
  }, blobServiceClient.credential).toString();
  return sasToken;
}

exports.upload = async (data, container, nanoId, fileName, size, mimeType) => {
  const stream = intoStream(data);
  const fullName = `${nanoId}/${fileName}`;
  const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(container);
  if (!containerClient.exists()) {
    await containerClient.create();
  }
  const blockBlobClient = containerClient.getBlockBlobClient(fullName);
  const options = { blobHTTPHeaders: { blobContentType: mimeType } }
  await blockBlobClient.uploadStream(stream, size, 5, options);
  const upload = {
    container: container,
    nanoId: nanoId,
    blobName: fileName,
    blobSize: size,
    mimeType: mimeType
  }
  return upload;
}

exports.delete = async (container, nanoId, fileName) => {
  const fullName = `${nanoId}/${fileName}`;
  const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(container);
  if (containerClient.exists()) {
    const blockBlobClient = containerClient.getBlockBlobClient(fullName);
    if (blockBlobClient.exists()) {
      await blockBlobClient.delete();
      return true;
    }
  }
  return false;
}
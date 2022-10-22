// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'lzepzwk7gi'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-dg6d9au7.us.auth0.com',            // Auth0 domain
  clientId: 'rLFet77LH80vaK5eE1bAeWsEGc7MHEfv',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
//https://9pnwauczn1.execute-api.us-east-1.amazonaws.com/dev/todos
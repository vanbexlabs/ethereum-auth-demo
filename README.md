# ethereum-auth-demo
Demo of signing into a backend website from Web3 using JSON Web Tokens.

## Installation
    npm install
    browserify frontend.js > public/bundle.js
    nodejs backend.js

## How to use
1. Install MetaMask in Chrome / Chromium and create an Ethereum account.
2. Browse to localhost:3000. You should see information about the Ethereum network and your account address.
3. Click "Sign in". You will be prompted in MetaMask to sign the message "Sign into demo app."
4. Click "Who am I" to check the backend knows your account address.

## How does it work
* The Web3 environment (MetaMask / Mist) is requested to sign a message using the account's private key.
* The account address and the signed message are POSTed to the backend.
* The backend verifies that the signature is correct and generates a signed Json Web Token (JWT) proving that the holder is in control of the address.
* The JWT is sent back to the web browser as a HttpOnly (not accessible from frontend JS) session cookie.

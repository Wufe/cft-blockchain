#!/bin/bash
# Verify a file with a public key using OpenSSL
# Decode the signature from Base64 format
#
# Usage: verify <file> <signature> <public_key>
#
# NOTE: to generate a public/private key use the following commands:
#
# openssl genrsa -aes128 -passout pass:<passphrase> -out private.pem 2048
# openssl rsa -in private.pem -passin pass:<passphrase> -pubout -out public.pem
#
# where <passphrase> is the passphrase to be used.

# filename=$1
publickey=$2

if [[ $# -lt 2 ]] ; then
  echo "Usage: verify <input> <public_key>"
  exit 1
fi

openssl base64 -d -in signature.sha256 -out /tmp/signature.sha256
echo $1 | openssl dgst -sha256 -verify $publickey -signature /tmp/signature.sha256
rm /tmp/signature.sha256
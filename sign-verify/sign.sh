#!/bin/bash
# Sign a file with a private key using OpenSSL
# Encode the signature in Base64 format
#
# Usage: sign <file> <private_key>
#
# NOTE: to generate a public/private key use the following commands:
#
# openssl genrsa -aes128 -passout pass:<passphrase> -out private.pem 2048
# openssl rsa -in private.pem -passin pass:<passphrase> -pubout -out public.pem
#
# where <passphrase> is the passphrase to be used.

# filename=$1
privatekey=$2

if [[ $# -lt 2 ]] ; then
  echo "Usage: sign <file> <private_key>"
  exit 1
fi

echo $1 | openssl dgst -sha256 -sign $privatekey -out /tmp/sig.sha256
openssl base64 -in /tmp/sig.sha256 -out signature.sha256
rm /tmp/sig.sha256
cat signature.sha256
#!/bin/bash

# set directory to store keys
CERT_DIR="cert"

# create directory if not exists
mkdir -p "$CERT_DIR"

# generate private key 2048 bit 
openssl genpkey -algorithm RSA -out "$CERT_DIR/private.pem" -pkeyopt rsa_keygen_bits:2048

# extract public key
openssl rsa -pubout -in "$CERT_DIR/private.pem" -out "$CERT_DIR/public.pem"


# Print Success Message
echo "Keys have been genrated in the $CERT_DIR/ folder"
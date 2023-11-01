#!/usr/bin/env bash

current_dir=$(dirname "$(realpath "$0")")
key_file="$current_dir/key.pem"
cert_file="$current_dir/cert.pem"
self_file="$current_dir/self.pem"
ext_file="$current_dir/openssl.ext"

openssl genrsa -out "$key_file" 4096
openssl req -new -out "$self_file" -key "$key_file" -subj '/CN=localhost'
openssl req -text -noout -in "$self_file"
openssl x509 -req -days 1024 -in "$self_file" -signkey "$key_file" -out "$cert_file" -extfile "$ext_file"

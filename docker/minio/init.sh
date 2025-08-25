#!/bin/bash

# Wait for MinIO to be ready
echo "Waiting for MinIO to be ready..."
sleep 15

# Configure MinIO client to connect to the minio service
echo "Configuring MinIO client..."
mc alias set minio http://minio:9000 minioadmin minioadmin123

# Test connection
echo "Testing connection to MinIO..."
mc admin info minio

# Create bucket for research documents
echo "Creating research-documents bucket..."
mc mb minio/research-documents --ignore-existing

# Set public read policy for the bucket (optional - for public file access)
echo "Setting bucket policy..."
mc anonymous set public minio/research-documents

echo "MinIO initialization completed successfully!"

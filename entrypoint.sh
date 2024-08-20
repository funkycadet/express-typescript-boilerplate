#!/bin/sh
echo "Waiting for database..."

while ! nc -z db 5432; do
  sleep 1
done

echo "Database started"

yarn migration:deploy

yarn migration:generate

yarn prisma:seed

yarn build && yarn start

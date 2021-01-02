# Decrypt the file
gpg --quiet --batch --yes --decrypt --passphrase="$SECRET_PASSPHRASE" --output .env.dev .env.dev.gpg
gpg --quiet --batch --yes --decrypt --passphrase="$SECRET_PASSPHRASE" --output .env.test .env.test.gpg

ls -a
# Decrypt the file
# SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
# echo $SCRIPTPATH

# for entry in "$SCRIPTPATH"/*
# do
#   echo "$entry"
# done

gpg --quiet --batch --yes --decrypt --passphrase="$SECRET_PASSPHRASE" --output $HOME/.env.dev .env.dev.gpg
gpg --quiet --batch --yes --decrypt --passphrase="$SECRET_PASSPHRASE" --output $HOME/.env.test .env.test.gpg

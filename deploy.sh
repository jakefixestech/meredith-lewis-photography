#!/bin/bash
set -e
git add .
git commit -m "update"
git pull origin main --no-rebase --no-edit
git push
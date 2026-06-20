#!/bin/bash
git add .
git commit -m "update"
git pull origin main --no-rebase
git push
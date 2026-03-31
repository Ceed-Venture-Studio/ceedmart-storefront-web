#!/bin/bash
set -e

# ============================================================
# CeedMart Storefront — Cloud Run Deploy Script
# ============================================================
# Usage:
#   ./deploy.sh
#
# Required: gcloud CLI authenticated
#   gcloud auth login
#   gcloud config set project ceedmart
# ============================================================

GCP_PROJECT_ID="ceedmart"
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY="pk_870f35bd3ecc53fdd67f7475dd17e290e6a7b8e249070851deb4bab58672b002"
NEXT_PUBLIC_DEFAULT_REGION="ng"
REGION="europe-west1"
SERVICE_NAME="ceedmart-storefront"
IMAGE="gcr.io/${GCP_PROJECT_ID}/${SERVICE_NAME}"

# ---- Production values ----
MEDUSA_BACKEND_URL="${MEDUSA_BACKEND_URL:-https://ceedmart-medusa-870514614467.europe-west1.run.app}"
NEXT_PUBLIC_BASE_URL="${NEXT_PUBLIC_BASE_URL:?Set NEXT_PUBLIC_BASE_URL (e.g. https://ceedmart.com or your Cloud Run URL)}"
REVALIDATE_SECRET="${REVALIDATE_SECRET:-supersecret}"

echo "=== CeedMart Storefront Deploy ==="
echo "Project:  ${GCP_PROJECT_ID}"
echo "Region:   ${REGION}"
echo "Backend:  ${MEDUSA_BACKEND_URL}"
echo "Frontend: ${NEXT_PUBLIC_BASE_URL}"
echo ""

echo "Building Docker image..."
docker build \
  --build-arg MEDUSA_BACKEND_URL="$MEDUSA_BACKEND_URL" \
  --build-arg NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY="$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY" \
  --build-arg NEXT_PUBLIC_BASE_URL="$NEXT_PUBLIC_BASE_URL" \
  --build-arg NEXT_PUBLIC_DEFAULT_REGION="$NEXT_PUBLIC_DEFAULT_REGION" \
  --build-arg REVALIDATE_SECRET="$REVALIDATE_SECRET" \
  -t "${IMAGE}:latest" \
  .

echo "Pushing to GCR..."
docker push "${IMAGE}:latest"

echo "Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --project "$GCP_PROJECT_ID" \
  --image "${IMAGE}:latest" \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL},REVALIDATE_SECRET=${REVALIDATE_SECRET}" \
  --min-instances 1 \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1 \
  --port 8000

echo ""
echo "Deploy complete!"
gcloud run services describe "$SERVICE_NAME" --project "$GCP_PROJECT_ID" --region "$REGION" --format='value(status.url)'

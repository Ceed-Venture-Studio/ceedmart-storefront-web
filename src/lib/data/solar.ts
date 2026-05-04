import { sdk } from "@lib/config"
import type {
  QuoteRequest,
  QuoteResponse,
  RecommendRequest,
  RecommendResponse,
} from "../../types/solar"

export async function recommendSolar(
  req: RecommendRequest
): Promise<RecommendResponse> {
  return sdk.client.fetch<RecommendResponse>("/store/solar/recommend", {
    method: "POST",
    body: req,
  })
}

export async function submitSolarQuote(
  req: QuoteRequest
): Promise<QuoteResponse> {
  return sdk.client.fetch<QuoteResponse>("/store/solar/quotes", {
    method: "POST",
    body: req,
  })
}

import type { Listing } from '../data'

export function guestRecommendation(home: Listing) {
  const reviews = home.verifiedReviews?.filter(review => review.stayCompleted && review.rating >= 1 && review.rating <= 5) || []
  const rating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : null
  return { count: reviews.length, rating, recommended: reviews.length >= 5 && rating !== null && rating >= 4.8 }
}

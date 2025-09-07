export default function SimpleProfileCardSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl shadow-lg p-8 w-full max-w-md relative border border-gray-700 animate-pulse">

        {/* Profile Picture Skeleton */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-700 mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Name Skeleton */}
        <div className="text-center mb-4">
          <div className="h-6 w-48 mx-auto rounded bg-gray-700"></div>
        </div>

        {/* Email Skeleton */}
        <div className="text-center mb-6">
          <div className="h-4 w-64 mx-auto rounded bg-gray-700"></div>
        </div>

        {/* Button Skeleton */}
        <div className="w-full h-10 rounded bg-gray-700 mx-auto"></div>
      </div>
    </div>
  );
}

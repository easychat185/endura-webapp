export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <div className="text-center">
        <div
          className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-transparent"
          style={{
            borderTopColor: "rgba(196,149,106,0.4)",
            borderRightColor: "rgba(196,149,106,0.1)",
          }}
        />
        <p className="mt-4 text-sm font-light text-white/50">Loading...</p>
      </div>
    </div>
  );
}

const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-rose-500/20 border border-rose-500/50 text-rose-300 px-4 py-3 rounded-xl text-xs md:text-sm text-center font-medium animate-pulse">
      ⚠️ {message}
    </div>
  );
};

export default ErrorAlert;

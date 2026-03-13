export const Toast = ({ message }: { message: string }) => (
  <div className="fixed bottom-6 right-6 glass px-4 py-3 rounded-xl text-sm text-stone-700">{message}</div>
);

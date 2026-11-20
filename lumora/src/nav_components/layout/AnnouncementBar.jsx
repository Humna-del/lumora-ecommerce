export default function AnnouncementBar() {
  return (
    <div className="bg-[#252525] text-[#FAF8F4] text-xs py-2.5 px-4 text-center tracking-wide">
      <p>
        <button
          type="button"
          className="underline underline-offset-4 hover:opacity-80 transition-opacity cursor-pointer"
        >
          Sign up
        </button>{" "}
        for early access to the Lumora Gift Gathering.
      </p>
    </div>
  );
}
export default function IPhoneAudioHelp() {
  return (
    <details className="max-w-sm text-sm text-emerald-200">
      <summary className="cursor-pointer underline underline-offset-4">
        iPhone audio not playing?
      </summary>
      <div className="mt-2 rounded border border-emerald-400/30 bg-black/80 p-3">
        <p>
          This app can’t detect whether your iPhone is in Silent mode. If audio
          isn’t playing, check the Ring/Silent switch or Action button and turn
          Silent mode off.
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Turn up the iPhone’s volume.</li>
          <li>Check that audio isn’t routed to Bluetooth headphones or a speaker.</li>
          <li>Tap the audio control in the app to enable sound.</li>
        </ul>
      </div>
    </details>
  );
}

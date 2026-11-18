import NeonTunnelGame from "./components/NeonTunnelGame.jsx";
import AmbientAudioControl from "./components/AmbientAudioControl.jsx";
import IPhoneAudioHelp from "./components/IPhoneAudioHelp.jsx";

export default function App() {
  return (
    <>
      <NeonTunnelGame />
      <div className="fixed bottom-4 left-4 z-10 space-y-3">
        <AmbientAudioControl />
        <IPhoneAudioHelp />
      </div>
    </>
  );
}

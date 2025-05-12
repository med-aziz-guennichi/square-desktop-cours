import { JitsiMeeting } from '@jitsi/react-sdk';
import { getMeetByName } from '@/apis/video-conferance/query-slice';
import { JITSI_CONFIG } from '@/constants/jitsi';
import { useUserStore } from '@/store/user-store';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useDeleteMeetMutation } from './hooks/use-delete-meet-mutation';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useEffect } from 'react';
import { Video } from 'lucide-react';
import FullPageLoader from '@/components/full-page-loader';

export default function MeetPage() {
  const { roomName } = useParams();
  const { setSousPages } = useBreadcrumb();
  const navigate = useNavigate();
  const user = useUserStore().decodedUser;
  useEffect(() => {
    setSousPages([
      { name: `Meet-${roomName}`, link: `/dashboard/meet/${roomName}`, icon: <Video size={16} /> },
    ]);
  }, [setSousPages, roomName]);
  const { data, error, isPending } = useQuery({
    queryKey: ['meet', roomName],
    queryFn: () => getMeetByName(roomName!),
    enabled: !!roomName,
  });
  const {mutate: deleteMeet} = useDeleteMeetMutation();

  if (isPending) return <div>Loading...</div>;
  if (error) {
    toast.error("La video conférence n'existe pas");
    navigate('/dashboard/classes');
  }
  return (
    <div style={{ position: 'relative', backgroundColor: "#000", overflow: "hidden" }}>
        <JitsiMeeting
          domain="meet.studiffy.com"
          roomName={roomName!}
          spinner={FullPageLoader}
          configOverwrite={{
            startWithAudioMuted: true,
            disableModeratorIndicator: true,
            startScreenSharing: true,
            enableEmailInStats: false,
            backgroundColor: '#000',
            localRecording: {
              disable: false,
              notifyAllParticipants: false,
              disableSelfRecording: false,
            },
            recordingService: {
              enabled: false,
              sharingEnabled: false,
              hideStorageWarning: false,
            },
            toolbarButtons: user?.role === "student" ? JITSI_CONFIG.student : JITSI_CONFIG.instructor,
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            APP_NAME: "Square",
          }}
          userInfo={{
            displayName: user?.email || "example@example.com",
            email: user?.email || "example@example.com",
          }}
          onApiReady={(externalApi) => {
            externalApi.executeCommand('displayName', user?.email);
            externalApi.on('readyToClose', () => {
              deleteMeet(data?._id);
              navigate("/");
            });
          }}
          getIFrameRef={(iframeRef) => { iframeRef.style.height = '100vh' }}
        />
    </div>
  );
}

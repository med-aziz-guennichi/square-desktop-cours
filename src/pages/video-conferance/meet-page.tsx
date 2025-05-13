import { getMeetByName } from '@/apis/video-conferance/query-slice';
import FullPageLoader from '@/components/full-page-loader';
import { JITSI_CONFIG } from '@/constants/jitsi';
import { useUserStore } from '@/store/user-store';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useDeleteMeetMutation } from './hooks/use-delete-meet-mutation';
import { useEffect } from 'react';
import { menu } from '@tauri-apps/api';

export default function MeetPage() {
  const { roomName } = useParams();
  const navigate = useNavigate();
  const user = useUserStore().decodedUser;
  const { data, error, isPending } = useQuery({
    queryKey: ['meet', roomName],
    queryFn: () => getMeetByName(roomName!),
    enabled: !!roomName,
  });
  const { mutate: deleteMeet } = useDeleteMeetMutation();

  useEffect(() => {
    // Prevent default context menu globally
    document.oncontextmenu = (e: MouseEvent) => e.preventDefault();

    // Setup Tauri menu with checkbox item
    const setupMenu = async () => {
      const myMenu = await menu.Menu.new({ id: '55', items: [] });

      await myMenu.append({
        text: 'Check',
        type: 'checkbox',
        checked: true,
        click: () => {
          console.warn('Check menu item clicked');
        },
      });

      // Optional: You can set the menu if needed (e.g., menu.setApplicationMenu)
      await myMenu.setAsAppMenu();
    };

    setupMenu();
  }, []);

  if (isPending) return <div>Loading...</div>;

  if (error) {
    toast.error("La video conférence n'existe pas");
    navigate('/dashboard/classes');
  }

  return (
    <div onContextMenu={(e) => e.preventDefault()}>
      <JitsiMeeting
        domain="sadkbhwp62nt7x.studiffy.com"
        roomName={roomName!}
        spinner={FullPageLoader}
        configOverwrite={{
          startWithAudioMuted: true,
          disableModeratorIndicator: true,
          startScreenSharing: true,
          enableEmailInStats: false,
          backgroundColor: '#000',
          disableContextMenu: true,
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
          toolbarButtons:
            user?.role === 'student'
              ? JITSI_CONFIG.student
              : JITSI_CONFIG.instructor,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          APP_NAME: 'Square',
        }}
        userInfo={{
          displayName: user?.email || 'example@example.com',
          email: user?.email || 'example@example.com',
        }}
        onApiReady={(externalApi) => {
          externalApi.executeCommand('displayName', user?.email);
          externalApi.on('readyToClose', () => {
            deleteMeet(data?._id);
            navigate('/');
          });
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100vh';
          iframeRef.onload = () => {
            iframeRef.addEventListener('contextmenu', (e: MouseEvent) => e.preventDefault());
          };
          iframeRef.addEventListener('contextmenu', (e) => e.preventDefault());
        }}
      />
    </div>
  );
}

import Logger from './logger';
import request from './request';

export type CallStatus = {
    id: number;
    user_id: number;
    status: string;
    call_type: string;
    scheduled_for: string | null;
    calendar_event_id: string | null;
    client_timezone: string;
    created_at: string;
    updated_at: string;
    reccuring_event_id: string | null;
    reccuring_status: string;
    duration: string;
    sent_intial_reminder?: string;
    medium: string;
    reminder_job_id?: string;
    video_url: string | null;
};

export const setClientTimeZone = async (newTimeZone: string, callStatus?: CallStatus) => {
    if (!callStatus) return;

    try {
        await request.put('/call_status', {
            call_status: { ...callStatus, client_timezone: newTimeZone },
        });
    } catch (error) {
        Logger.error(error, 'Could not update client time zone');
    }
};

export const getCallStatus = async (): Promise<CallStatus | undefined> => {
    try {
        const { data } = await request.get('/call_status');

        return data.call_status;
    } catch (error) {
        Logger.error(error, 'Could not fetch call status');
        return;
    }
};

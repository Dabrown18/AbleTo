import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { selectImages } from '@src/redux/slices/imageSlice/selectors';
import { Template } from '@src/services/activities/types';

const useImage = () => {
    const images = useSelector(selectImages);

    const getActivityImagePath = useCallback(
        (templateName: Template, activitySlug: string, imageName: string) => {
            // These are pretty nested
            if (
                !images?.activityImages ||
                !images.activityImages[templateName] ||
                !images.activityImages[templateName][activitySlug] ||
                !images.activityImages[templateName][activitySlug][imageName]
            )
                return '';

            const imagePath = images.activityImages[templateName][activitySlug][imageName];

            // Images start with /web and no baseUrl for localhost
            // So we add in the emulator local path
            if (imagePath.startsWith('/web')) {
                return `http://10.0.2.2:5000/${imagePath}`;
            }

            // Staging and production start with //
            // and include a baseUrl, with no https prefix
            return imagePath.replace('//', 'https://');
        },
        [images]
    );

    return { getActivityImagePath };
};

export default useImage;

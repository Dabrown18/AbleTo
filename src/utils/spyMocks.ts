import { AccessibilityInfo } from 'react-native';

import { mockAddEventListener } from './mocks/accessibilityInfo';

// Add mocks that we'd like to spy on globally in any tests.
// This file is referenced in `jest.config.js`.
jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation(mockAddEventListener as any);

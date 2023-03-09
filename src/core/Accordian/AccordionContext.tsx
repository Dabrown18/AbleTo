import { createContext, useContext } from 'react';

type AccordionContextType = {
    isExpanded: boolean;
    onToggle(): void;
};

const defaultAccordionContext: AccordionContextType = {
    isExpanded: false,
    onToggle: () => {},
};

export const AccordionContext = createContext<AccordionContextType>(defaultAccordionContext);
export const useAccordion = () => useContext(AccordionContext);

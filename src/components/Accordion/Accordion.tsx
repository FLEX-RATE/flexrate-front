'use client';

import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

import {
  AccordionValue,
  Container,
  Header,
  ImageContainer,
  Option,
  Title,
  Wrapper,
} from './Accordion.style';

interface AccordionProps<T extends string> {
  options: readonly T[];
  title?: string;
  value?: T;
  onSelect: (value: T) => void;
}

const Accordion = <T extends string>({ options, title, value, onSelect }: AccordionProps<T>) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <Wrapper>
      {title && <Title>{title}</Title>}
      <Container ref={ref} open={open}>
        <Header onClick={() => setOpen((prev) => !prev)} data-testid="type-accordion">
          <AccordionValue>{value}</AccordionValue>
          <ImageContainer $open={open}>
            <Image src={'/icons/downArrow_24.svg'} width={14} height={24} alt="아래 화살표" />
          </ImageContainer>
        </Header>
        <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              {options.map((option) => (
                <Option
                  key={option}
                  onClick={() => {
                    onSelect(option);
                    setOpen(false);
                  }}
                  selected={option === value}
                >
                  {option}
                </Option>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </Container>
    </Wrapper>
  );
};

export default Accordion;

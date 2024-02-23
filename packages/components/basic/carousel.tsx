import {useState, ReactNode} from 'react';
import {Pressable} from 'react-native';

export type CarouselItem = {
  label: string,
}

export type CarouselParams = {
  contents: CarouselItem[], 
  onNavigate: (current: CarouselItem) => void,
}

export const Carousel: (CarouselParams) => ReactNode = ({contents, onNavigate}) => {  
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = contents?.[currentIndex] ?? {label: ""};
  const previous = contents?.[currentIndex - 1] ?? {label: ""};
  const next = contents?.[currentIndex + 1] ?? {label: ""};

  const handlePrevious = () => {
    setCurrentIndex(currentIndex - 1);
    onNavigate(contents[currentIndex - 1]);
  };
  const handleNext = () => {
    setCurrentIndex(currentIndex + 1);
    onNavigate(contents[currentIndex + 1]);
  };

  return <div className="flex w-full space-x-20 place-content-center pb-20">
    <Pressable disabled={currentIndex <= 0} onPress={handlePrevious}>
      <span>{previous.label}</span>
    </Pressable>
    <span className="text-2xl">{current.label}</span>
    <Pressable disabled={currentIndex >= contents.length} onPress={handleNext}>
      <span>{next.label}</span>
    </Pressable>
  </div>
};
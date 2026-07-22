'use client'

import { Carousel, useTickerItem } from 'motion-plus/react'
import { motion, useTransform } from 'motion/react'

import image1 from '@/images/photos/image-1.jpg'
import image2 from '@/images/photos/image-2.jpg'
import image3 from '@/images/photos/image-3.jpg'
import image4 from '@/images/photos/image-4.jpg'
import image5 from '@/images/photos/image-5.jpg'
import togetherImage from '@/images/tutugreen_tawny_together.jpg'

const photos = [
  { src: image1.src, name: 'image-1' },
  { src: image2.src, name: 'image-2' },
  { src: image3.src, name: 'image-3' },
  { src: image4.src, name: 'image-4' },
  { src: image5.src, name: 'image-5' },
  { src: togetherImage.src, name: 'tutugreen-tawny-together' },
]

function CoverflowItem({ src, index }: { src: string; index: number }) {
  const { offset, props } = useTickerItem()

  const { rotateY, scale } = useTransform(offset, [-200, 0, 200], {
    rotateY: [20, 0, -20],
    scale: [0.7, 1, 0.7],
  })
  const x = useTransform(
    offset,
    [-800, -200, 200, 800],
    ['100%', '0%', '0%', '-100%'],
  )
  const zIndex = useTransform(offset, (value) =>
    Math.max(0, Math.round(1000 - Math.abs(value))),
  )

  return (
    <motion.li {...props} style={{ ...props.style, zIndex }}>
      <motion.img
        draggable={false}
        src={src}
        alt={`Photo ${index + 1}`}
        className="coverflow-item"
        style={{ transformPerspective: 500, x, rotateY, scale }}
      />
    </motion.li>
  )
}

export function PhotoCarousel() {
  return (
    <>
      <div className="mask">
        <Carousel
          className="coverflow-carousel"
          items={photos.map((photo, index) => (
            <CoverflowItem
              key={photo.name}
              src={photo.src}
              index={index}
            />
          ))}
          overflow
          gap={0}
          itemSize="manual"
          safeMargin={200}
        />
      </div>
      <style>{styles}</style>
    </>
  )
}

const styles = `
.mask {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  mask-image: linear-gradient(to right, transparent 10%, black 25%, black 75%, transparent 90%);
  -webkit-mask-image: linear-gradient(to right, transparent 10%, black 25%, black 75%, transparent 90%);
}

.coverflow-carousel {
  width: 350px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coverflow-item {
  width: 350px;
  height: 350px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  will-change: transform, opacity;
}

@media (max-width: 600px) {
  .coverflow-carousel {
    width: 250px;
    height: 250px;
  }
  .coverflow-item {
    width: 250px;
    height: 250px;
  }
}
`

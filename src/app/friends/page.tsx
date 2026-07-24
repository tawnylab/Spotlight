'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'

import {
  LinkIcon,
  BilibiliIcon,
  TiktokIcon,
  XiaohongshuIcon,
} from '@/components/SocialIcons'
import { MagneticHover } from '@/components/motion/MagneticHover'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { TextReveal } from '@/components/motion/TextReveal'
import { TiltCard } from '@/components/motion/TiltCard'

import imageTutugreen from '@/images/friends/tutugreen.png'
import imageZJYGD from '@/images/friends/zjygd.avif'
import imageLiMiaoU from '@/images/friends/limiaou.webp'
import imagePeanut from '@/images/friends/peanut.webp'

const people: {
  name: string
  role: string
  imageUrl: any
  personalUrl?: string
  bilibiliUrl?: string
  tiktokUrl?: string
  xiaohongshuUrl?: string
}[] = [
  {
    name: 'tutugreen',
    role: '云计算佬大',
    imageUrl: imageTutugreen,
    personalUrl: 'https://tutugreen.com',
    bilibiliUrl: 'https://space.bilibili.com/1713718',
    xiaohongshuUrl:
      'https://www.xiaohongshu.com/user/profile/634a6639000000001802d562',
  },
  {
    name: 'ZJ一锅端',
    role: '游戏奶爸',
    imageUrl: imageZJYGD,
    bilibiliUrl: 'https://space.bilibili.com/2207789',
    tiktokUrl:
      'https://www.douyin.com/user/MS4wLjABAAAAEUso_0PQl8QWqidxYnLf0z3GGLGXHHECVkArfETYWmU',
    xiaohongshuUrl:
      'https://www.xiaohongshu.com/user/profile/602f3c3d00000000010077ac',
  },
  {
    name: '宇怂二喵',
    role: '帅猫',
    imageUrl: imageLiMiaoU,
    bilibiliUrl: 'https://space.bilibili.com/14626829',
    tiktokUrl:
      'https://www.douyin.com/user/MS4wLjABAAAAo-1rh7UNXCzH2SxYWA5f2Ac1oQ9jh3Sm0Syp_yBBHck',
    xiaohongshuUrl:
      'https://www.xiaohongshu.com/user/profile/5b83acda3fbd150001570096',
  },
  {
    name: '花生',
    role: '妈宝猫',
    imageUrl: imagePeanut,
    xiaohongshuUrl:
      'https://www.xiaohongshu.com/user/profile/5ab3cbafe8ac2b308a5115ec',
  },
]

function OrbitingRing() {
  let reduce = useReducedMotion()
  if (reduce) return null
  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 rounded-full border border-dashed border-accent/50"
      animate={{ rotate: 360 }}
      transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
    />
  )
}

export default function Friends() {
  return (
    <div className="py-32">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <div className="mx-auto max-w-2xl">
          <TextReveal
            as="h2"
            text="友情链接"
            className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
          />
          <p className="mt-4 text-lg leading-8 text-ink-soft">
            这里面个个都是人才，说话又好听，我超喜欢这里的。
          </p>
        </div>
        <StaggerGroup
          as="ul"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          {people.map((person) => (
            <li key={person.name}>
              <TiltCard maxTilt={5} className="mx-auto size-56">
                <div className="relative size-56">
                  <OrbitingRing />
                  <Image
                    src={person.imageUrl}
                    alt=""
                    className="absolute inset-0 size-56 rounded-full object-cover ring-1 ring-line"
                    unoptimized
                  />
                </div>
              </TiltCard>
              <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-ink">
                {person.name}
              </h3>
              <p className="text-sm leading-6 text-ink-soft">{person.role}</p>
              <ul role="list" className="mt-6 flex justify-center gap-x-6">
                {person.personalUrl && (
                  <li>
                    <MagneticHover>
                      <a
                        href={person.personalUrl}
                        className="fill-muted text-muted transition hover:fill-accent hover:text-accent"
                      >
                        <span className="sr-only">Friendly Link</span>
                        <LinkIcon className="size-5" />
                      </a>
                    </MagneticHover>
                  </li>
                )}
                {person.bilibiliUrl && (
                  <li>
                    <MagneticHover>
                      <a
                        href={person.bilibiliUrl}
                        className="fill-muted text-muted transition hover:fill-accent hover:text-accent"
                      >
                        <span className="sr-only">Bilibili</span>
                        <BilibiliIcon className="size-5" />
                      </a>
                    </MagneticHover>
                  </li>
                )}
                {person.tiktokUrl && (
                  <li>
                    <MagneticHover>
                      <a
                        href={person.tiktokUrl}
                        className="fill-muted text-muted transition hover:fill-accent hover:text-accent"
                      >
                        <span className="sr-only">Tik Tok</span>
                        <TiktokIcon className="size-5" />
                      </a>
                    </MagneticHover>
                  </li>
                )}
                {person.xiaohongshuUrl && (
                  <li>
                    <MagneticHover>
                      <a
                        href={person.xiaohongshuUrl}
                        className="fill-muted text-muted transition hover:fill-accent hover:text-accent"
                      >
                        <span className="sr-only">Xiao Hong Shu</span>
                        <XiaohongshuIcon className="size-5" />
                      </a>
                    </MagneticHover>
                  </li>
                )}
              </ul>
            </li>
          ))}
        </StaggerGroup>
      </div>
    </div>
  )
}

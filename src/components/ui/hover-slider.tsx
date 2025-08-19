"use client"

import * as React from "react"
import { type HTMLMotionProps, MotionConfig, motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TextStaggerHoverProps {
	text: string
	index: number
}
interface HoverSliderImageProps {
	index: number
	imageUrl: string
}
type HoverSliderProps = {}
interface HoverSliderContextValue {
	activeSlide: number
	changeSlide: (index: number) => void
}
function splitText(text: string) {
	const words = text.split(" ").map((word) => word.concat(" "))
	const characters = words.flatMap((word) => word.split(""))

	return {
		words,
		characters,
	}
}

const HoverSliderContext = React.createContext<HoverSliderContextValue | undefined>(undefined)
function useHoverSliderContext() {
	const context = React.useContext(HoverSliderContext)
	if (context === undefined) {
		throw new Error("useHoverSliderContext must be used within a HoverSliderProvider")
	}
	return context
}

export const HoverSlider = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & HoverSliderProps>(
	({ children, className, ...props }, ref) => {
		const [activeSlide, setActiveSlide] = React.useState<number>(0)
		const changeSlide = React.useCallback((index: number) => setActiveSlide(index), [setActiveSlide])
		return (
			<HoverSliderContext.Provider value={{ activeSlide, changeSlide }}>
				<div className={className}>{children}</div>
			</HoverSliderContext.Provider>
		)
	},
)
HoverSlider.displayName = "HoverSlider"

const WordStaggerHover = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
	({ children, className, ...props }, ref) => {
		return (
			<span className={cn("relative inline-block origin-bottom overflow-hidden")} {...props}>
				{children}
			</span>
		)
	},
)
WordStaggerHover.displayName = "WordStaggerHover"

export const TextStaggerHover = React.forwardRef<
	HTMLElement,
	React.HTMLAttributes<HTMLElement> & TextStaggerHoverProps
>(({ text, index, children, className, ...props }, ref) => {
	const { activeSlide, changeSlide } = useHoverSliderContext()
	const { characters } = splitText(text)
	const isActive = activeSlide === index
	const handleMouse = () => changeSlide(index)
	return (
		<span
			className={cn("relative inline-block origin-bottom overflow-hidden", className)}
			{...props}
			ref={ref}
			onMouseEnter={handleMouse}
		>
			{characters.map((char, index) => (
				<span key={`${char}-${index}`} className="relative inline-block overflow-hidden">
					<MotionConfig
						transition={{
							delay: index * 0.01,
							duration: 0.3,
							ease: [0.25, 0.46, 0.45, 0.94],
						}}
					>
						<motion.span
							className="inline-block"
							initial={{ y: "0%", scale: 1, filter: "blur(0px)", opacity: 0.3 }}
							animate={
								isActive
									? { y: "-120%", scale: 0.8, filter: "blur(2px)", opacity: 0 }
								: { y: "0%", scale: 1, filter: "blur(0px)", opacity: 0.3 }
							}
						>
							{char}
							{char === " " && index < characters.length - 1 && <>&nbsp;</>}
						</motion.span>

						<motion.span
							className="absolute left-0 top-0 inline-block"
							initial={{ y: "120%", scale: 1.1, filter: "blur(1px)", opacity: 0 }}
							animate={
								isActive
									? { y: "0%", scale: 1, filter: "blur(0px)", opacity: 1 }
								: { y: "120%", scale: 1.1, filter: "blur(1px)", opacity: 0 }
							}
							transition={{
								delay: index * 0.01,
								duration: 0.4,
								ease: [0.25, 0.46, 0.45, 0.94],
								scale: { type: "spring", stiffness: 300, damping: 25 },
							}}
						>
							{char}
						</motion.span>
					</MotionConfig>
				</span>
			))}
		</span>
	)
})
TextStaggerHover.displayName = "TextStaggerHover"

export const clipPathVariants = {
	visible: {
		clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
		scale: 1,
		opacity: 1,
		filter: "blur(0px) brightness(1)",
	},
	hidden: {
		clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0px)",
		scale: 1.05,
		opacity: 0.7,
		filter: "blur(1px) brightness(0.9)",
	},
}

export const HoverSliderImageWrap = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					"grid overflow-hidden [&>*]:col-start-1 [&>*]:col-end-1 [&>*]:row-start-1 [&>*]:row-end-1 [&>*]:size-full",
					className,
				)}
				{...props}
			/>
		)
	},
)
HoverSliderImageWrap.displayName = "HoverSliderImageWrap"

export const HoverSliderImage = React.forwardRef<HTMLImageElement, HTMLMotionProps<"img"> & HoverSliderImageProps>(
	({ index, imageUrl, children, className, ...props }, ref) => {
		const { activeSlide } = useHoverSliderContext()
		return (
			<motion.img
				className={cn("inline-block align-middle", className)}
				transition={{
					ease: [0.25, 0.46, 0.45, 0.94],
					duration: 0.6,
					scale: { type: "spring", stiffness: 200, damping: 20 },
					opacity: { duration: 0.4 },
					filter: { duration: 0.3 },
				}}
				variants={clipPathVariants}
				animate={activeSlide === index ? "visible" : "hidden"}
				whileHover={activeSlide === index ? { scale: 1.02 } : {}}
				ref={ref}
				{...props}
			/>
		)
	},
)
HoverSliderImage.displayName = "HoverSliderImage"

const TEAM_MEMBERS = [
	{
		id: "alexander",
		name: "Alexander Permut",
		role: "Co-Founder & CEO",
		focus: "GTM, Brand, Clients",
		imageUrl:
			"https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Alex-permut.jpg-f8TTuTdb5lbA8bTwFiNGOFcWMBSo9k.jpeg",
	},
	{
		id: "brian",
		name: "Brian Permut",
		role: "Co-Founder & CTO",
		focus: "Full-Stack, Automation & AI",
		imageUrl:
			"https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brian-permut.jpg-HB695ikHYz645dZqtn0vurNvNcsG9k.jpeg",
	},
	{
		id: "sanket",
		name: "Sanket Deshpande",
		role: "Founding ML Engineer",
		focus: "LLMs, Multimodal, Systems",
		imageUrl:
			"https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SanketTeamPhoto.jpg-pB1HDpMGETMMprJvwkt2ZAJUuW5DlZ.jpeg",
	},
	{
		id: "salim",
		name: "Salim Masmoudi",
		role: "Senior AI Engineer",
		focus: "Computer Vision & Agents",
		imageUrl:
			"https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SalimTeamPhoto.jpg-psNIqhVj7nwZ77Kkx6SFZul39i6Bsk.jpeg",
	},
]

export function HoverSliderDemo() {
	return (
		<HoverSlider className="min-h-svh place-content-center p-6 md:px-12 bg-white text-black">
			<div className="flex flex-wrap items-center justify-evenly gap-6 md:gap-12">
				<div className="flex flex-col space-y-2 md:space-y-4">
					{TEAM_MEMBERS.map((member, index) => (
						<motion.div
							key={member.name}
							className="cursor-pointer"
							whileHover={{ x: 8 }}
							transition={{ type: "spring", stiffness: 400, damping: 25 }}
						>
							<TextStaggerHover
								index={index}
								className="text-4xl font-bold uppercase tracking-tighter block"
								text={member.name}
							/>
						</motion.div>
					))}
				</div>
				<div className="flex flex-col">
					<HoverSliderImageWrap>
						{TEAM_MEMBERS.map((member, index) => (
							<div key={member.id} className="">
								<HoverSliderImage
									index={index}
									imageUrl={member.imageUrl}
									src={member.imageUrl}
									alt={`${member.name} - ${member.role}`}
									className="size-full max-h-96 object-cover rounded-lg"
									loading="eager"
									decoding="async"
								/>
							</div>
						))}
					</HoverSliderImageWrap>
					<div className="mt-4 relative min-h-[5.5rem] md:min-h-[4.5rem] sm:min-h-[4.5rem] overflow-hidden text-center px-2">
						{TEAM_MEMBERS.map((member, index) => (
							<HoverSliderContext.Consumer key={member.id}>
								{(context) => (
									<motion.div
										className="absolute inset-0 text-sm text-black whitespace-normal break-words"
										initial={{ y: 10, opacity: 0 }}
										animate={context?.activeSlide === index ? { y: 0, opacity: 1 } : { y: -10, opacity: 0 }}
										transition={{
											type: "spring",
											stiffness: 400,
											damping: 25,
											opacity: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
										}}
									>
										{member.role.split("").map((char, charIndex) => (
											<motion.span
												key={charIndex}
												initial={{ opacity: 0, y: 3 }}
												animate={context?.activeSlide === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 3 }}
												transition={{
													delay: charIndex * 0.008,
													duration: 0.25,
													ease: [0.25, 0.46, 0.45, 0.94],
												}}
											>
												{char}
											</motion.span>
										))}
										<motion.span
											className="mx-1"
											initial={{ opacity: 0, scale: 0.8 }}
											animate={context?.activeSlide === index ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
											transition={{
												delay: member.role.length * 0.008,
												duration: 0.2,
												ease: [0.25, 0.46, 0.45, 0.94],
											}}
										>
											•
										</motion.span>
										{member.focus.split("").map((char, charIndex) => (
											<motion.span
												key={charIndex + member.role.length}
												initial={{ opacity: 0, y: 3 }}
												animate={context?.activeSlide === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 3 }}
												transition={{
													delay: (charIndex + member.role.length + 2) * 0.008,
													duration: 0.25,
													ease: [0.25, 0.46, 0.45, 0.94],
												}}
											>
												{char}
											</motion.span>
										))}
									</motion.div>
								)}
							</HoverSliderContext.Consumer>
						))}
					</div>
				</div>
			</div>
		</HoverSlider>
	)
}



import Image from "next/image";
import { JourneyPath } from "./JourneyPath";
import { JourneyTimeline } from "./JourneyTimeline";

export function Section1() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 pt-14 pb-24 lg:px-24 lg:pt-24 lg:pb-16">
      <p className="font-heading text-[14px] font-bold leading-[normal] text-content-brand-secondary lg:text-[20px] lg:leading-[26px]">
        {"A CHILD'S GROWTH PATH"}
      </p>
      <h2 className="mt-3 font-heading text-[20px] font-bold leading-[30px] text-content-brand lg:text-[40px] lg:font-semibold lg:leading-[48px]">
        One Connected Journey, Every Step of the Way
      </h2>
      <JourneyTimeline
        className="relative mt-16 hidden lg:block"
        style={{ aspectRatio: "1248 / 1939" }}
      >
        <JourneyPath />
        <div>
          <div
            data-journey-card
            className="absolute rounded-[20px] border-4 p-[26px]"
            style={{
              left: "0%",
              top: "4.951003074232851%",
              width: "32.316730769230766%",
              backgroundColor: "#e9f5f2",
              borderColor: "#cfe4de",
            }}
          >
            <p className="font-heading text-[24px] font-bold leading-[30px] text-content-brand">
              MEET THE CHILD
            </p>
            <p className="mt-[9px] text-[18px] leading-[27px] text-text-secondary">
              Understand each child’s unique learning needs.
            </p>
          </div>
          <div
            data-journey-connector
            className="absolute border-t-2 border-dashed border-[#9ca3af]"
            style={{
              left: "32.55885416666667%",
              top: "8.509538401721247%",
              width: "21.270913461538463%",
            }}
          ></div>
          <div
            data-journey-node
            className="absolute flex items-center justify-center rounded-full border-[3px] border-[#c79acc] bg-white shadow-[0px_3px_8px_0px_rgba(107,64,128,0.16)]"
            style={{
              left: "50.05608974358975%",
              top: "6.217588943237494%",
              width: "7.559871794871794%",
              aspectRatio: "1 / 1",
            }}
          >
            <span aria-hidden="true" data-journey-ring className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#c79acc] opacity-0" />
            <span className="font-heading text-[40px] font-semibold leading-none text-[#9a3fa0]">
              1
            </span>
          </div>
          <div
            data-journey-image
            className="absolute"
            style={{
              left: "60.857812499999994%",
              top: "-2.201735450780041%",
              width: "28.46398237179487%",
              aspectRatio: "355.2305 / 326.5564",
            }}
          >
            <Image
              src="/images/homepage/steps01.webp"
              alt="Observing and understanding a child’s unique needs"
              fill
              sizes="355px"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </div>
        <div>
          <div
            data-journey-card
            className="absolute rounded-[20px] border-4 p-[26px]"
            style={{
              left: "67.90967948717949%",
              top: "25.94120420883832%",
              width: "31.9975641025641%",
              backgroundColor: "#f4e4f5",
              borderColor: "#e4c9e7",
            }}
          >
            <p className="font-heading text-[24px] font-bold leading-[30px] text-content-brand">
              ANSWER QUESTIONS
            </p>
            <p className="mt-[9px] text-[18px] leading-[27px] text-text-secondary">
              Gain insights through developmental screening questions.
            </p>
          </div>
          <div
            data-journey-connector
            className="absolute border-t-2 border-dashed border-[#9ca3af]"
            style={{
              left: "48.36388621794872%",
              top: "29.499739536326715%",
              width: "19.306145833333332%",
            }}
          ></div>
          <div
            data-journey-node
            className="absolute flex items-center justify-center rounded-full border-[3px] border-[#c79acc] bg-white shadow-[0px_3px_8px_0px_rgba(107,64,128,0.16)]"
            style={{
              left: "43.7900641025641%",
              top: "27.271420815336516%",
              width: "7.52244391025641%",
              aspectRatio: "1 / 1",
            }}
          >
            <span aria-hidden="true" data-journey-ring className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#c79acc] opacity-0" />
            <span className="font-heading text-[40px] font-semibold leading-none text-[#9a3fa0]">
              2
            </span>
          </div>
          <div
            data-journey-image
            className="absolute"
            style={{
              left: "12.072748397435898%",
              top: "18.798780278977567%",
              width: "27.438421474358975%",
              aspectRatio: "342.4315 / 350.6467",
            }}
          >
            <Image
              src="/images/homepage/steps02.webp"
              alt="Turning observations into clearer developmental insights"
              fill
              sizes="355px"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </div>
        <div>
          <div
            data-journey-card
            className="absolute rounded-[20px] border-4 p-[26px]"
            style={{
              left: "0%",
              top: "45.79679987670836%",
              width: "32.05399038461538%",
              backgroundColor: "#fff7de",
              borderColor: "#efe3be",
            }}
          >
            <p className="font-heading text-[24px] font-bold leading-[30px] text-content-brand">
              ASSIGN PLAN
            </p>
            <p className="mt-[9px] text-[18px] leading-[27px] text-text-secondary">
              Create plans around individual developmental goals.
            </p>
          </div>
          <div
            data-journey-connector
            className="absolute border-t-2 border-dashed border-[#9ca3af]"
            style={{
              left: "32.29414262820512%",
              top: "49.355335204196756%",
              width: "16.009567307692308%",
            }}
          ></div>
          <div
            data-journey-node
            className="absolute flex items-center justify-center rounded-full border-[3px] border-[#c79acc] bg-white shadow-[0px_3px_8px_0px_rgba(107,64,128,0.16)]"
            style={{
              left: "45.92012820512821%",
              top: "47.021761196976534%",
              width: "7.529078525641027%",
              aspectRatio: "1 / 1",
            }}
          >
            <span aria-hidden="true" data-journey-ring className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#c79acc] opacity-0" />
            <span className="font-heading text-[40px] font-semibold leading-none text-[#9a3fa0]">
              3
            </span>
          </div>
          <div
            data-journey-image
            className="absolute"
            style={{
              left: "60.42055288461539%",
              top: "43.21815108867329%",
              width: "27.802211538461542%",
              aspectRatio: "346.9716 / 303.4948",
            }}
          >
            <Image
              src="/images/homepage/steps03.webp"
              alt="Building learning activities around developmental goals"
              fill
              sizes="355px"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </div>
        <div>
          <div
            data-journey-card
            className="absolute rounded-[20px] border-4 p-[26px]"
            style={{
              left: "67.54790865384615%",
              top: "67.30703711239686%",
              width: "32.45210737179487%",
              backgroundColor: "#fce8e2",
              borderColor: "#f0cfc2",
            }}
          >
            <p className="font-heading text-[24px] font-bold leading-[30px] text-content-brand">
              PERSONALISE LEARNING
            </p>
            <p className="mt-[9px] text-[18px] leading-[27px] text-text-secondary">
              Build skills through personalised learning activities.
            </p>
          </div>
          <div
            data-journey-connector
            className="absolute border-t-2 border-dashed border-[#9ca3af]"
            style={{
              left: "55.36858173076923%",
              top: "71.07186434292807%",
              width: "12.139519230769231%",
            }}
          ></div>
          <div
            data-journey-node
            className="absolute flex items-center justify-center rounded-full border-[3px] border-[#c79acc] bg-white shadow-[0px_3px_8px_0px_rgba(107,64,128,0.16)]"
            style={{
              left: "48.1650641025641%",
              top: "68.6273929659296%",
              width: "7.575689102564103%",
              aspectRatio: "1 / 1",
            }}
          >
            <span aria-hidden="true" data-journey-ring className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#c79acc] opacity-0" />
            <span className="font-heading text-[40px] font-semibold leading-none text-[#9a3fa0]">
              4
            </span>
          </div>
          <div
            data-journey-image
            className="absolute"
            style={{
              left: "12.649719551282052%",
              top: "61.83126609640923%",
              width: "27.182387820512822%",
              aspectRatio: "339.2362 / 323.5076",
            }}
          >
            <Image
              src="/images/homepage/steps04.webp"
              alt="Adapting learning to a child’s pace and progress"
              fill
              sizes="355px"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </div>
        <div>
          <div
            data-journey-card
            className="absolute rounded-[20px] border-4 p-[26px]"
            style={{
              left: "0%",
              top: "87.00360750950877%",
              width: "32.05399038461538%",
              backgroundColor: "#e9fae5",
              borderColor: "#cfe8c6",
            }}
          >
            <p className="font-heading text-[24px] font-bold leading-[30px] text-content-brand">
              MONITOR GROWTH
            </p>
            <p className="mt-[9px] text-[18px] leading-[27px] text-text-secondary">
              Track progress and adapt learning continuously.
            </p>
          </div>
          <div
            data-journey-connector
            className="absolute border-t-2 border-dashed border-[#9ca3af]"
            style={{
              left: "32.29414262820512%",
              top: "91.45047187258251%",
              width: "9.57204326923077%",
            }}
          ></div>
          <div
            data-journey-node
            className="absolute flex items-center justify-center rounded-full border-[3px] border-[#c79acc] bg-white shadow-[0px_3px_8px_0px_rgba(107,64,128,0.16)]"
            style={{
              left: "42.33173076923077%",
              top: "89.11688239346957%",
              width: "7.529078525641027%",
              aspectRatio: "1 / 1",
            }}
          >
            <span aria-hidden="true" data-journey-ring className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#c79acc] opacity-0" />
            <span className="font-heading text-[40px] font-semibold leading-none text-[#9a3fa0]">
              5
            </span>
          </div>
          <div
            data-journey-image
            className="absolute"
            style={{
              left: "61.947628205128204%",
              top: "82.99682050589865%",
              width: "27.474495192307696%",
              aspectRatio: "342.8817 / 304.2645",
            }}
          >
            <Image
              src="/images/homepage/steps05.webp"
              alt="Tracking meaningful progress over time"
              fill
              sizes="355px"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </div>
      </JourneyTimeline>
      <div className="mt-10 flex flex-col items-center lg:hidden">
        <div className="flex w-full flex-col items-center">
          <div
            className="flex w-full flex-col items-start gap-2 rounded-[20px] border-4 p-[18px]"
            style={{ backgroundColor: "#e9f5f2", borderColor: "#cfe4de" }}
          >
            <div className="flex items-center gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#b55aba] text-[14px] text-white">
                1
              </span>
              <p className="font-heading text-[16px] font-bold leading-[27px] text-brand-teal">
                MEET THE CHILD
              </p>
            </div>
            <p className="text-[14px] leading-[22px] text-text-default">
              Understand each child’s unique learning needs.
            </p>
          </div>
          <div className="relative mt-8 h-[240px] w-full max-w-[262px]">
            <Image
              src="/images/homepage/steps01.webp"
              alt="Observing and understanding a child’s unique needs"
              fill
              sizes="262px"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col items-center gap-[7px] py-4">
            <div className="h-[9px] w-[3px] shrink-0 rounded-[2px] bg-[#c79acc]"></div>
            <div className="h-[9px] w-[3px] shrink-0 rounded-[2px] bg-[#c79acc]"></div>
            <div className="h-[9px] w-[3px] shrink-0 rounded-[2px] bg-[#c79acc]"></div>
            <div className="h-[9px] w-[3px] shrink-0 rounded-[2px] bg-[#c79acc]"></div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center">
          <div
            className="flex w-full flex-col items-start gap-2 rounded-[20px] border-4 p-[18px]"
            style={{ backgroundColor: "#f4e4f5", borderColor: "#e4c9e7" }}
          >
            <div className="flex items-center gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#b55aba] text-[14px] text-white">
                2
              </span>
              <p className="font-heading text-[16px] font-bold leading-[27px] text-brand-teal">
                ANSWER QUESTIONS
              </p>
            </div>
            <p className="text-[14px] leading-[22px] text-text-default">
              Gain insights through developmental screening questions.
            </p>
          </div>
          <div className="relative mt-8 h-[240px] w-full max-w-[262px]">
            <Image
              src="/images/homepage/steps02.webp"
              alt="Turning observations into clearer developmental insights"
              fill
              sizes="262px"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col items-center gap-[7px] py-4">
            <div className="h-[9px] w-[3px] shrink-0 rounded-[2px] bg-[#c79acc]"></div>
            <div className="h-[9px] w-[3px] shrink-0 rounded-[2px] bg-[#c79acc]"></div>
            <div className="h-[9px] w-[3px] shrink-0 rounded-[2px] bg-[#c79acc]"></div>
            <div className="h-[9px] w-[3px] shrink-0 rounded-[2px] bg-[#c79acc]"></div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center">
          <div
            className="flex w-full flex-col items-start gap-2 rounded-[20px] border-4 p-[18px]"
            style={{ backgroundColor: "#fff7de", borderColor: "#efe3be" }}
          >
            <div className="flex items-center gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#b55aba] text-[14px] text-white">
                3
              </span>
              <p className="font-heading text-[16px] font-bold leading-[27px] text-brand-teal">
                ASSIGN PLAN
              </p>
            </div>
            <p className="text-[14px] leading-[22px] text-text-default">
              Create plans around individual developmental goals.
            </p>
          </div>
          <div className="relative mt-8 h-[240px] w-full max-w-[262px]">
            <Image
              src="/images/homepage/steps03.webp"
              alt="Building learning activities around developmental goals"
              fill
              sizes="262px"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col items-center gap-[7px] py-4">
            <div className="h-[9px] w-[3px] shrink-0 rounded-[2px] bg-[#c79acc]"></div>
            <div className="h-[9px] w-[3px] shrink-0 rounded-[2px] bg-[#c79acc]"></div>
            <div className="h-[9px] w-[3px] shrink-0 rounded-[2px] bg-[#c79acc]"></div>
            <div className="h-[9px] w-[3px] shrink-0 rounded-[2px] bg-[#c79acc]"></div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center">
          <div
            className="flex w-full flex-col items-start gap-2 rounded-[20px] border-4 p-[18px]"
            style={{ backgroundColor: "#fce8e2", borderColor: "#f0cfc2" }}
          >
            <div className="flex items-center gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#b55aba] text-[14px] text-white">
                4
              </span>
              <p className="font-heading text-[16px] font-bold leading-[27px] text-brand-teal">
                PERSONALISE LEARNING
              </p>
            </div>
            <p className="text-[14px] leading-[22px] text-text-default">
              Build skills through personalised learning activities.
            </p>
          </div>
          <div className="relative mt-8 h-[240px] w-full max-w-[262px]">
            <Image
              src="/images/homepage/steps04.webp"
              alt="Adapting learning to a child’s pace and progress"
              fill
              sizes="262px"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col items-center gap-[7px] py-4">
            <div className="h-[9px] w-[3px] shrink-0 rounded-[2px] bg-[#c79acc]"></div>
            <div className="h-[9px] w-[3px] shrink-0 rounded-[2px] bg-[#c79acc]"></div>
            <div className="h-[9px] w-[3px] shrink-0 rounded-[2px] bg-[#c79acc]"></div>
            <div className="h-[9px] w-[3px] shrink-0 rounded-[2px] bg-[#c79acc]"></div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center">
          <div
            className="flex w-full flex-col items-start gap-2 rounded-[20px] border-4 p-[18px]"
            style={{ backgroundColor: "#e9fae5", borderColor: "#cfe8c6" }}
          >
            <div className="flex items-center gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#b55aba] text-[14px] text-white">
                5
              </span>
              <p className="font-heading text-[16px] font-bold leading-[27px] text-brand-teal">
                MONITOR GROWTH
              </p>
            </div>
            <p className="text-[14px] leading-[22px] text-text-default">
              Track progress and adapt learning continuously.
            </p>
          </div>
          <div className="relative mt-8 h-[240px] w-full max-w-[262px]">
            <Image
              src="/images/homepage/steps05.webp"
              alt="Tracking meaningful progress over time"
              fill
              sizes="262px"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

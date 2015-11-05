---
title: How to Plan Your Next Computer Build or Upgrade
author: Brandtley McMinn
tags:
    - computers
    - builds
    - hardware
    - howto
categories:
    - howtos
---
## Preface

Building your own computer is both an exciting and aggravating experience which requires technical knowledge of computer hardware, attention to minute detail in hardware specs, and an eye for aesthetics. All of these components play a major role in your decision making and can affect your Bill of Materials (BOM) and price point for your build.

Today I want to go over the process I use to determine what I want out of my machine and what components I need to achieve that goal all the while trying to keep within my budget.

My number one rule when it comes to planning a major investment is **be patient**.

Take your time, and do plenty of research on each of the components you may be considering. Evaluate manufacturers, resellers, hardware specs, prices, discounts, product reviews, performance details, etc until you have all the information you need to make an informed decision. If you follow this procedure, you will be less likely to make poor decisions on incompatible hardware or blowing your budget.


## Picking your components:

I usually plan my upgrades around my budget and how long I would like my upgrades to last in the ever changing landscape of hardware and software performance. So under each component type I have provided an overview of my recommendations on features and qualities you should consider as you're making your decisions, and my list of preferred manufacturers.

I have organized this process in order of decision priority, so you can pick all the hardware you need for your build and ensure that each piece is compatible with your spec and your budget.


-----

### 1. Uninterruptible Power Supply (UPS)

I would be remiss not mentioning this, but the single most important upgrade you can make to your build if nothing else is buying a decent UPS.

A UPS is designed to ensure your machine has stable power during every day operation. If your area is prone to power blips, brownouts or blackouts, then you have likely dealt with your computer restarting mid keystroke, or worse bricked your machine in a puff of magic smoke.

These devices come in a wide range of form factors and power ratings, and some come at a pretty significant price tag. I personally invested in a simple 825VA CyberPower model that keeps my machine running when the power gets wierd, but it only has to last long enough for me to shut down my computer properly so I don't risk damaging my machine, so a 20 minute runtime is a pretty good option for most people.


<div class="keep-in-mind">
    <strong>Keep in mind</strong>
    <p>
        Regardless of power rating or runtime specs, your UPS's mileage will vary wildly depending if your machine is idle or processing lots of data, how many monitors you have connected, etc.
    </p>
</div>


#### Bottom line:

If you don't do it for yourself, do it for your wallet, because the initial investment you make upfront can save you countless time and money in unsaved work and hardware replacements over the life of your build.

#### Recommended brands:

- APC, CyberPower



### 2. Central Processor (CPU)

The CPU is the brain of your machine and should be one of the first items you pick because it typically affects what motherboard (MOBO) you'll be looking into. Many folks think they need the fastest CPU for hardcore gaming sessions or crunching through massive amounts of graphics or video processing tasks, though that isn't necessarily true in today's market and I'll discuss why later.

#### Preferred Brands:

Personally I prefer Intel CPUs because that's all I have ever used aside from an AMD laptop I owned years back, but I have never had a problem with them and they are usually pretty stable.

Whether you're building an HTPC (Home Theatre Personal Computer), a gaming machine or a workhorse PC, you can't go wrong with Intel `i` series processors. Specifically looking at the Intel i5/i7 quadcore models.

- Intel i5: budget friendly, decent performance
- Intel i7: better performance, higher cost

#### General notes:

- Regarding Intel model numbers, those ending in `K` are "unlocked" meaning they have more potential for overclocking, but tend to be more expensive.
- If you plan to have dedicated graphics (GPU), CPU models that claim "discreet graphics" or "HD Graphics" are not necessary.
- Processor socket types are usually well labeled, but keep in mind the newer socket types may not have wide enough support when it comes to compatible hardware like motherboards.


-----

### 2. Motherboard (MOBO)

The MOBO of your build is determined by

MOBO: something that supports the socket size/pinset of the processor you choose, and supports 4 slots of 1600Mhz+ DDR3 ram (most newer models do this up to 2400Mhz)
- WHATEVER MOBO YOU CHOOSE, make sure it matches the CPU socket number
    - some models support a range of socket types
    - Intel models are `LGA ####`
    - AMD are `AM#` or `AM#+`
- optional features are number of USB/USB3 ports, SATA ports, built-in ethernet/networking/wireless/bluetooth/audio
- another optional feature I like is a digital status code readout on-board. This will be a 2x 8-segment digital display that makes debugging your machine SO much easier.


-----

### 3. CPU cooling: Heatsink vs Liquid cooling

Most CPU's typically come with a fan cooled CPU heatsink from the manufacturer, but some don't. The heatsink is required to move heat away from the CPU to avoid destroying your computer.

You have a number of options in this arena, between a fan cooled heatsink from the manufacture, an after market heatsink with better cooling performance, or a liquid cooling system.

#### General notes:

- Fan cooled and radiator style heatsinks are cheaper and offer decent cooling, but require adequate contact surface cleaning and thermal compound during installation to be effective.
- Certain heatsink selections can be constrained by certain factors, such as physical size, CPU socket mounting types, power requirements, fan or no fan?, case size, conflicting component layout/clearance, etc.
- Stock heatsinks bundled with your CPU are fine for typical builds, but if you plan to do marathon gaming sessions or heavy processing tasks, you may want to look into an after market heatsink to improve performance.

#### Recommended Brands:

- CoolerMaster, ThermalTake



-----

### 4. RAM:
- 16Gb or more of 1600Mhz+ DDR3 (you can buy 4x 4Gb kits for cheap)
- Don't focus too much on the clocking specs, but keep in mind that consistent timings are what you're looking for (7-9-9-9, 8-8-8-8, etc would be decent)
- Good brands: Crucial, G.Skill, Corsair are my top 3 for price and performance

-----

### 5. Graphics Card _or_ Graphical Processing Unit (GPU)

I mentioned earlier that CPU performance is a critical factor in your build, and that is reasonably true to a certain extent. However in todays software landscape, software companies like Adobe are building their software to leverage the parallel processing capabilities of your graphics card (GPU) to spread the computational load and improve application performance.

That whole process began back in 2007 when Nvidia released their Compute Unified Device Architecture (CUDA) technology which they pioneered to give software and game developers programmable access into the GPU's vast hardware capabilities for developing advanced render pipelines and performance enhancements. Software makers in turn began leveraging CUDA to utilize the parallel processing cores in your GPU which are far superior at resource intensive number crunching which frees up the CPU to focus on tasks like managing operating system processes and runtime cycles.

GPU:
- Nvidia GTX 960 or higher
- Basically, more dedicated ram, the better the performance (2Gb+ of GDDR5)
- Brands I like: EVGA, PNY, ASUS
- I personally prefer Nvidia because I find they are consistently stable
- AMD's GPUs claim higher specs than Nvidia, but I find their stability to be questionable.
- Keep in mind, your GPU selection affects your power requirements (more PSU power/6pin vs 8pin power cable requirements)

-----

### 6. Power Supply Unit (PSU)

The power supply is one area you don't want to skimp out on either. Certain brands have garnered huge fanbases the world over and for good reason. They manufacture a reliable product that

- 600-800 watts would be sufficient, but keep in mind what power connectors you require
    - MOBO: usually 20+4pin main power and a 4pin CPU power cable
    - GPU: typically 2x 6pin, 6pin/8pin, or 2x 8pin
- Brands I like: Corsair, Cooler Master, Rosewill, Thermaltake
- For "80 Plus" power ratings, bronze level aren't bad and tend to be more budget friendly, but don't assume that gold and platinum rated units are always superior.
- Try to find a modular power supply to keep your cable management clean (this is more of a preference, but can affect price point)

#### Recommended brands:

- Corsair, Cooler Master, Rosewill, Thermaltake


-----

### 6. Data Storage

Considering how rapidly the storage market has changed the past several years and how cheap the technology is becoming, I have a couple recommendations:

1. Buy an SSD (Solid State Drive) as your main system drive.
    - The speed benefits alone for boot and system performance are well worth the cost, and it's getting cheaper per unit of storage all the time.
    - You can refer to [The Wirecutter](http://thewirecutter.com/reviews/best-ssds/) for a well informed opinion on SSD selections as well as other hardware consumer reports.
2. Buy a data drive for everything else:
    - If you have a lot of applications, music, movies or games, a large data drive will do wonders for your build.
    - Even if you don't have a lot of media or games, consider getting a 3Tb+ 6Gb/s SATA disk drive.
    - You won't be hurting for disk space anytime soon, and you can consider getting a couple extras to ghost as backups of your data drive since you'll have plenty of case slots.


#### Recommended brands:

- SSD: Crucial, Samsung
- HDD: Seagate, Western Digital



Storage: Solid State vs Hard disk storage
- SSD: pricey for size, but 256Gb would be more than enough for a C:\ drive
- http://thewirecutter.com/reviews/best-ssds/
- Brands I like: Crucial, Wester Digital

- HDD: more size, generally slower, better as a data drive D:\
- You can buy a 3Tb Western Digital SATA 6Gbs w/ 64Mb cache for ~$90

-----

### 7. Computer Case, Fans, and Accessories

For the the last few items on our list you can do one of two things.

1. Cheap out on a case big enough for your build with no frills, features or a disc drive because you can just run everything off USB and the internet.
1. Invest in a super expensive and flashy designer case that may be difficult to build in, but will look super cool in your game cave.
1. Or buy the biggest case you can find to house all your computers guts plus your liquid cooling reservoir with radiator fans, three 200mm exhaust fans, enough room for a six disk RAID-0 array, three bluray disc drives for burning and ripping media at the same time, AND a heap of LED strips and tubes to make it glow like the beautiful spaceship it is.

OK, three things, but the point is it all comes down to what you think is practical and aesthetically pleasing. I personally prefer a clean looking box with decent ventilation and enough room for cable management and air flow, but you may have a completely different opinion on this.

There are so many brands and styles of cases and accessories that you can waste a lot of money and time researching and buying up all the kitchy tech you can think of, but I'll leave that up to you.

In my opinion, the main things you should consider are:

- Reuse your old case or buy new. Totally your call
- I find Cooler Master and Rosewill cases are decently priced, have ample space and cable routing options, decent airflow, and generally have nice aesthetics.
- Keep in mind the materials it's made of:
  - Steel cases weigh more
  - Plastic case parts can break
- Number of fan mounts is important because you can buy more fans if needed.
- I usually layout my fans to intake from the front and exhaust out the top and back.
- Compatable Fan sizes should be in the range of 80mm-120mm as these are the most common sizes you'll find.


## That's a wrap!

And that is my process for deciding on how to build and upgrade my machine. To recap, you should definitely consider what your primary goals are for the machine you want to build, decide on a budget, and take your time working through this list of priorities so you don't end up mismatching components in the process.

Hope this helps, and happy building! :)

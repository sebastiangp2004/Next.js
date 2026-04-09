// import 'dotenv/config'
// import { PrismaClient } from '../app/generated/prisma'
// import { PrismaNeon } from '@prisma/adapter-neon'
// import { neon } from '@neondatabase/serverless'

// const sql = neon(process.env.DATABASE_URL!)
// const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
// const prisma = new PrismaClient({ adapter })

// async function main() {

//     console.log('🌱 Starting seed...')

//     // -----------------------------
//     // 1. Clean database
//     // -----------------------------

//     await prisma.games.deleteMany()
//     await prisma.consoles.deleteMany()

//     console.log('🧹 Database cleaned')

//     // -----------------------------
//     // 2. Create Consoles
//     // -----------------------------

//     const consoles = await prisma.consoles.createMany({
//         data: [
//             {
//                 name: 'PlayStation 5',
//                 image: 'playstation5.jpg',
//                 manufacturer: 'Sony Interactive Entertainment',
//                 releasedate: new Date('2020-11-12'),
//                 description:
//                     'The PlayStation 5 (PS5) is a home video games console bringing 4K gaming at 120Hz and ray tracing support.',
//             },
//             {
//                 name: 'Xbox Series X',
//                 image: 'xboxseriesx.jpg',
//                 manufacturer: 'Microsoft',
//                 releasedate: new Date('2020-11-10'),
//                 description:
//                     'The Xbox Series X is a high-performance console, featuring a custom AMD processor and 12 TFLOPS of graphical power.',
//             },
//             {
//                 name: 'Nintendo Switch OLED Model',
//                 image: 'switch.jpg',
//                 manufacturer: 'Nintendo',
//                 releasedate: new Date('2021-10-08'),
//                 description:
//                     'A hybrid console that can be used as a home console and a portable handheld device, now with a vibrant OLED screen.',
//             },
//             {
//                 name: 'Nintendo Switch 2',
//                 image: 'switch2.jpg',
//                 manufacturer: 'Nintendo',
//                 releasedate: new Date('2025-06-05'),
//                 description:
//                     'The successor to the popular Nintendo Switch, featuring larger magnetic Joy-cons and enhanced performance.',
//             },
//             {
//                 name: 'Steam Deck OLED',
//                 image: 'steam.jpg',
//                 manufacturer: 'Valve',
//                 releasedate: new Date('2023-11-16'),
//                 description:
//                     'A powerful handheld gaming computer that plays PC gamess from your Steam library on the go.',
//             },
//         ],
//     })

//     console.log('🎮 5 consoles seeded')

//     // -----------------------------
//     // 3. Get consoles from DB
//     // -----------------------------

//     const allConsoles = await prisma.consoles.findMany()

//     const ps5 = allConsoles.find(c => c.name === 'PlayStation 5')
//     const xbox = allConsoles.find(c => c.name === 'Xbox Series X')
//     const switchOLED = allConsoles.find(c => c.name === 'Nintendo Switch OLED Model')
//     const switch2 = allConsoles.find(c => c.name === 'Nintendo Switch 2')
//     const steamDeck = allConsoles.find(c => c.name === 'Steam Deck OLED')

//     // -----------------------------
//     // 4. Create gamess
//     // -----------------------------

//     const gamessData = [
//         {
//             title: 'God of War Ragnarök',
//             cover: 'gowrak.jpeg',
//             developer: 'Santa Monica Studio',
//             releasedate: new Date('2022-11-09'),
//             price: 69.99,
//             genre: 'Action-adventure',
//             description:
//                 'Kratos and Atreus must journey to each of the Nine Realms and find answers as the forces of Asgard prepare for a prophesied battle.',
//             console_id: ps5?.id,
//         },
//         {
//             title: 'Halo Infinite',
//             cover: 'halo.jpeg',
//             developer: '343 Industries',
//             releasedate: new Date('2021-12-08'),
//             price: 59.99,
//             genre: 'First-person shooter',
//             description:
//                 'Master Chief returns in the most expansive Halo campaign yet.',
//             console_id: xbox?.id,
//         },
//         {
//             title: 'The Legend of Zelda: Tears of the Kingdom',
//             cover: 'zelda.jpeg',
//             developer: 'Nintendo EPD',
//             releasedate: new Date('2023-05-12'),
//             price: 69.99,
//             genre: 'Action-adventure',
//             description:
//                 'Link soars through the skies and explores new areas of Hyrule.',
//             console_id: switchOLED?.id,
//         },
//         {
//             title: 'Elden Ring',
//             cover: 'eldenring.jpeg',
//             developer: 'FromSoftware',
//             releasedate: new Date('2022-02-25'),
//             price: 59.99,
//             genre: 'Action role-playing',
//             description:
//                 'A fantasy action RPG adventure set within a world created by Hidetaka Miyazaki.',
//             console_id: ps5?.id,
//         },
//         {
//             title: 'Forza Horizon 5',
//             cover: 'forza.jpeg',
//             developer: 'Playground gamess',
//             releasedate: new Date('2021-11-09'),
//             price: 59.99,
//             genre: 'Racing',
//             description:
//                 'Explore the vibrant open world landscapes of Mexico.',
//             console_id: xbox?.id,
//         },
//         {
//             title: 'Pokémon Scarlet',
//             cover: 'pokemon.jpeg',
//             developer: 'games Freak',
//             releasedate: new Date('2022-11-18'),
//             price: 59.99,
//             genre: 'Role-playing',
//             description:
//                 'Embark on a new journey in the Paldea region.',
//             console_id: switchOLED?.id,
//         },
//         {
//             title: 'Spider-Man 2',
//             cover: 'spiderman.jpeg',
//             developer: 'Insomniac gamess',
//             releasedate: new Date('2023-10-20'),
//             price: 69.99,
//             genre: 'Action-adventure',
//             description:
//                 'Peter Parker and Miles Morales face the Symbiote threat.',
//             console_id: ps5?.id,
//         },
//         {
//             title: 'Starfield',
//             cover: 'starfield.jpeg',
//             developer: 'Bethesda games Studios',
//             releasedate: new Date('2023-09-06'),
//             price: 69.99,
//             genre: 'Role-playing',
//             description:
//                 'Explore the vastness of space and create your own story.',
//             console_id: xbox?.id,
//         },
//         {
//             title: 'Mario Kart 9',
//             cover: 'mariokart.jpeg',
//             developer: 'Nintendo EPD',
//             releasedate: new Date('2025-12-01'),
//             price: 59.99,
//             genre: 'Racing',
//             description:
//                 'The next installment in the popular Mario Kart series.',
//             console_id: switch2?.id,
//         },
//         {
//             title: 'Hogwarts Legacy',
//             cover: 'hogwarts.jpeg',
//             developer: 'Avalanche Software',
//             releasedate: new Date('2023-02-10'),
//             price: 59.99,
//             genre: 'Action role-playing',
//             description:
//                 'Experience a new story set in the wizarding world.',
//             console_id: steamDeck?.id,
//         },
//         {
//             title: 'Rocket League',
//             cover: 'no-cover.jpg',
//             developer: 'Psyonix',
//             releasedate: new Date('2015-07-07'),
//             price: 19.99,
//             genre: 'Sports',
//             description:
//                 'Soccer meets driving in this unique multiplayer game.',
//             console_id: xbox?.id,
//         },
//         {
//             title: 'Black Myth: Wukong',
//             cover: 'black_myth_wukong.jpg',
//             developer: 'Game Science',
//             releasedate: new Date('2024-08-20'),
//             price: 59.99,
//             genre: 'Action-adventure',
//             description:
//                 'An action RPG inspired by Journey to the West.',
//             console_id: ps5?.id,
//         },
//         {
//             title: 'Cyberpunk 2077',
//             cover: 'no-cover.jpg',
//             developer: 'CD Projekt Red',
//             releasedate: new Date('2020-12-10'),
//             price: 49.99,
//             genre: 'Action role-playing',
//             description:
//                 'A dystopian open-world RPG set in Night City.',
//             console_id: ps5?.id,
//         },
//         {
//             title: 'The Witcher 3: Wild Hunt',
//             cover: 'no-cover.jpg',
//             developer: 'CD Projekt Red',
//             releasedate: new Date('2015-05-19'),
//             price: 39.99,
//             genre: 'Action role-playing',
//             description:
//                 'Hunt monsters and make choices in this epic RPG.',
//             console_id: xbox?.id,
//         },
//         {
//             title: 'Super Mario Odyssey',
//             cover: 'no-cover.jpg',
//             developer: 'Nintendo EPD',
//             releasedate: new Date('2017-10-27'),
//             price: 59.99,
//             genre: 'Platformer',
//             description:
//                 'Join Mario on a globe-trotting adventure.',
//             console_id: switchOLED?.id,
//         },
//         {
//             title: 'FIFA 24',
//             cover: 'no-cover.jpg',
//             developer: 'EA Sports',
//             releasedate: new Date('2023-09-29'),
//             price: 69.99,
//             genre: 'Sports',
//             description:
//                 'The latest in the FIFA soccer series.',
//             console_id: ps5?.id,
//         },
//         {
//             title: 'Call of Duty: Modern Warfare III',
//             cover: 'no-cover.jpg',
//             developer: 'Sledgehammer Games',
//             releasedate: new Date('2023-11-10'),
//             price: 69.99,
//             genre: 'First-person shooter',
//             description:
//                 'Intense multiplayer and campaign action.',
//             console_id: xbox?.id,
//         },
//         {
//             title: 'Animal Crossing: New Horizons',
//             cover: 'no-cover.jpg',
//             developer: 'Nintendo EPD',
//             releasedate: new Date('2020-03-20'),
//             price: 59.99,
//             genre: 'Simulation',
//             description:
//                 'Build your island paradise.',
//             console_id: switchOLED?.id,
//         },
//         {
//             title: 'Grand Theft Auto V',
//             cover: 'no-cover.jpg',
//             developer: 'Rockstar Games',
//             releasedate: new Date('2013-09-17'),
//             price: 29.99,
//             genre: 'Action-adventure',
//             description:
//                 'Open-world crime and mayhem.',
//             console_id: ps5?.id,
//         },
//         {
//             title: 'Minecraft',
//             cover: 'no-cover.jpg',
//             developer: 'Mojang Studios',
//             releasedate: new Date('2011-11-18'),
//             price: 29.99,
//             genre: 'Sandbox',
//             description:
//                 'Build and explore in a blocky world.',
//             console_id: switch2?.id,
//         },
//         {
//             title: 'Assassins Creed Valhalla',
//             cover: 'no-cover.jpg',
//             developer: 'Ubisoft',
//             releasedate: new Date('2020-11-10'),
//             price: 59.99,
//             genre: 'Action role-playing',
//             description:
//                 'Viking adventure in the Assassin\'s Creed series.',
//             console_id: xbox?.id,
//         },
//         {
//             title: 'The Last of Us Part II',
//             cover: 'no-cover.jpg',
//             developer: 'Naughty Dog',
//             releasedate: new Date('2020-06-19'),
//             price: 39.99,
//             genre: 'Action-adventure',
//             description:
//                 'Emotional story-driven game.',
//             console_id: ps5?.id,
//         },
//         {
//             title: 'Fortnite',
//             cover: 'no-cover.jpg',
//             developer: 'Epic Games',
//             releasedate: new Date('2017-07-25'),
//             price: 0.00,
//             genre: 'Battle royale',
//             description:
//                 'Free-to-play battle royale with building.',
//             console_id: switchOLED?.id,
//         },
//         {
//             title: 'Red Dead Redemption 2',
//             cover: 'no-cover.jpg',
//             developer: 'Rockstar Games',
//             releasedate: new Date('2018-10-26'),
//             price: 49.99,
//             genre: 'Action-adventure',
//             description:
//                 'Western open-world epic.',
//             console_id: ps5?.id,
//         },
//         {
//             title: 'Overwatch 2',
//             cover: 'no-cover.jpg',
//             developer: 'Blizzard Entertainment',
//             releasedate: new Date('2022-10-04'),
//             price: 39.99,
//             genre: 'First-person shooter',
//             description:
//                 'Team-based multiplayer shooter.',
//             console_id: xbox?.id,
//         },
//         {
//             title: 'Splatoon 3',
//             cover: 'no-cover.jpg',
//             developer: 'Nintendo EPD',
//             releasedate: new Date('2022-09-09'),
//             price: 59.99,
//             genre: 'Third-person shooter',
//             description:
//                 'Ink-splatting multiplayer fun.',
//             console_id: switchOLED?.id,
//         },
//         {
//             title: 'Horizon Forbidden West',
//             cover: 'no-cover.jpg',
//             developer: 'Guerrilla Games',
//             releasedate: new Date('2022-02-18'),
//             price: 69.99,
//             genre: 'Action role-playing',
//             description:
//                 'Post-apocalyptic adventure with Aloy.',
//             console_id: ps5?.id,
//         },
//         {
//             title: 'Sea of Thieves',
//             cover: 'no-cover.jpg',
//             developer: 'Rare',
//             releasedate: new Date('2018-03-20'),
//             price: 39.99,
//             genre: 'Action-adventure',
//             description:
//                 'Pirate adventure on the high seas.',
//             console_id: xbox?.id,
//         },
//         {
//             title: 'Kirby and the Forgotten Land',
//             cover: 'no-cover.jpg',
//             developer: 'HAL Laboratory',
//             releasedate: new Date('2022-03-25'),
//             price: 59.99,
//             genre: 'Platformer',
//             description:
//                 'Kirbys latest platforming adventure.',
//             console_id: switchOLED?.id,
//         },
//         {
//             title: 'Resident Evil Village',
//             cover: 'no-cover.jpg',
//             developer: 'Capcom',
//             releasedate: new Date('2021-05-07'),
//             price: 39.99,
//             genre: 'Survival horror',
//             description:
//                 'Horror survival game in a village.',
//             console_id: ps5?.id,
//         },
//         {
//             title: 'NBA 2K24',
//             cover: 'no-cover.jpg',
//             developer: 'Visual Concepts',
//             releasedate: new Date('2023-09-08'),
//             price: 59.99,
//             genre: 'Sports',
//             description:
//                 'Basketball simulation game.',
//             console_id: xbox?.id,
//         },
//         {
//             title: 'Fire Emblem: Engage',
//             cover: 'no-cover.jpg',
//             developer: 'Intelligent Systems',
//             releasedate: new Date('2023-01-20'),
//             price: 59.99,
//             genre: 'Tactical role-playing',
//             description:
//                 'Strategy RPG with turn-based combat.',
//             console_id: switchOLED?.id,
//         },
//         {
//             title: 'Ghost of Tsushima',
//             cover: 'no-cover.jpg',
//             developer: 'Sucker Punch Productions',
//             releasedate: new Date('2020-07-17'),
//             price: 49.99,
//             genre: 'Action-adventure',
//             description:
//                 'Samurai story in feudal Japan.',
//             console_id: ps5?.id,
//         },
//         {
//             title: 'Gears 5',
//             cover: 'no-cover.jpg',
//             developer: 'The Coalition',
//             releasedate: new Date('2019-09-10'),
//             price: 39.99,
//             genre: 'Third-person shooter',
//             description:
//                 'Intense shooter with co-op.',
//             console_id: xbox?.id,
//         },
//         {
//             title: 'Xenoblade Chronicles 3',
//             cover: 'no-cover.jpg',
//             developer: 'Monolith Soft',
//             releasedate: new Date('2022-07-29'),
//             price: 59.99,
//             genre: 'Action role-playing',
//             description:
//                 'JRPG with vast world exploration.',
//             console_id: switchOLED?.id,
//         },
//         {
//             title: 'Bloodborne',
//             cover: 'no-cover.jpg',
//             developer: 'FromSoftware',
//             releasedate: new Date('2015-03-24'),
//             price: 19.99,
//             genre: 'Action role-playing',
//             description:
//                 'Challenging gothic horror RPG.',
//             console_id: ps5?.id,
//         },
//         {
//             title: 'Forza Motorsport',
//             cover: 'no-cover.jpg',
//             developer: 'Turn 10 Studios',
//             releasedate: new Date('2023-10-10'),
//             price: 69.99,
//             genre: 'Racing',
//             description:
//                 'Simulation racing with detailed cars.',
//             console_id: xbox?.id,
//         },
//         {
//             title: 'Metroid Dread',
//             cover: 'no-cover.jpg',
//             developer: 'MercurySteam',
//             releasedate: new Date('2021-10-08'),
//             price: 59.99,
//             genre: 'Action-adventure',
//             description:
//                 '2D Metroidvania exploration.',
//             console_id: switchOLED?.id,
//         },
//         {
//             title: 'Demons Souls',
//             cover: 'no-cover.jpg',
//             developer: 'Bluepoint Games',
//             releasedate: new Date('2020-11-12'),
//             price: 69.99,
//             genre: 'Action role-playing',
//             description:
//                 'Remake of the classic souls-like.',
//             console_id: ps5?.id,
//         },
//         {
//             title: 'Halo: The Master Chief Collection',
//             cover: 'no-cover.jpg',
//             developer: '343 Industries',
//             releasedate: new Date('2014-11-11'),
//             price: 39.99,
//             genre: 'First-person shooter',
//             description:
//                 'Collection of Halo games.',
//             console_id: xbox?.id,
//         },
//         {
//             title: 'Luigis Mansion 3',
//             cover: 'no-cover.jpg',
//             developer: 'Next Level Games',
//             releasedate: new Date('2019-10-31'),
//             price: 59.99,
//             genre: 'Action-adventure',
//             description:
//                 'Ghost-hunting with Luigi.',
//             console_id: switchOLED?.id,
//         },
//         {
//             title: 'Ratchet & Clank: Rift Apart',
//             cover: 'no-cover.jpg',
//             developer: 'Insomniac Games',
//             releasedate: new Date('2021-06-11'),
//             price: 69.99,
//             genre: 'Platformer',
//             description:
//                 'Dimensional-hopping adventure.',
//             console_id: ps5?.id,
//         },
//         {
//             title: 'State of Decay 2',
//             cover: 'no-cover.jpg',
//             developer: 'Undead Labs',
//             releasedate: new Date('2018-05-22'),
//             price: 29.99,
//             genre: 'Survival',
//             description:
//                 'Zombie survival management.',
//             console_id: xbox?.id,
//         },
//         {
//             title: 'Hyrule Warriors: Age of Calamity',
//             cover: 'no-cover.jpg',
//             developer: 'Omega Force',
//             releasedate: new Date('2020-11-20'),
//             price: 59.99,
//             genre: 'Hack and slash',
//             description:
//                 'Zelda-themed musou game.',
//             console_id: switchOLED?.id,
//         },
//         {
//             title: 'Death Stranding',
//             cover: 'no-cover.jpg',
//             developer: 'Kojima Productions',
//             releasedate: new Date('2019-11-08'),
//             price: 39.99,
//             genre: 'Action-adventure',
//             description:
//                 'Unique delivery simulation.',
//             console_id: ps5?.id,
//         },
//         {
//             title: 'Ori and the Will of the Wisps',
//             cover: 'no-cover.jpg',
//             developer: 'Moon Studios',
//             releasedate: new Date('2020-03-11'),
//             price: 29.99,
//             genre: 'Platformer',
//             description:
//                 'Beautiful metroidvania platformer.',
//             console_id: xbox?.id,
//         },
//         {
//             title: 'No Mans Sky',
//             cover: 'no-cover.jpg',
//             developer: 'Hello Games',
//             releasedate: new Date('2016-08-09'),
//             price: 59.99,
//             genre: 'Adventure',
//             description:
//                 'Explore infinite procedurally generated universe.',
//             console_id: switchOLED?.id,
//         },
//         {
//             title: 'Control',
//             cover: 'no-cover.jpg',
//             developer: 'Remedy Entertainment',
//             releasedate: new Date('2019-08-27'),
//             price: 39.99,
//             genre: 'Action-adventure',
//             description:
//                 'Supernatural agency thriller.',
//             console_id: ps5?.id,
//         },
//         {
//             title: 'Hellblade: Senuas Sacrifice',
//             cover: 'no-cover.jpg',
//             developer: 'Ninja Theory',
//             releasedate: new Date('2017-08-08'),
//             price: 29.99,
//             genre: 'Action-adventure',
//             description:
//                 'Psychological horror journey.',
//             console_id: xbox?.id,
//         },
//         {
//             title: 'Celeste',
//             cover: 'no-cover.jpg',
//             developer: 'Matt Makes Games',
//             releasedate: new Date('2018-01-25'),
//             price: 19.99,
//             genre: 'Platformer',
//             description:
//                 'Challenging platformer with story.',
//             console_id: switchOLED?.id,
//         },
//     ]

//     for (const game of gamessData) {
//         if (!game.console_id) continue

//         await prisma.games.create({
//             data: game,
//         })
//     }

//     console.log('🕹️ 50 gamess seeded')

//     console.log('✅ Seed completed successfully')
// }

// main()
//     .catch((e) => {
//         console.error(e)
//         process.exit(1)
//     })
//     .finally(async () => {
//         await prisma.$disconnect()
//     })
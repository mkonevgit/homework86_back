const mongoose = require("mongoose");

const User = require("./models/User");
const Artist = require("./models/Artist");
const Album = require("./models/Album");
const Track = require("./models/Track");


const {nanoid} = require("nanoid");

mongoose.connect("mongodb://localhost:27017/musicDB",
   {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true, useCreateIndex: true},
);

const db = mongoose.connection;

db.once("open", async () => {
   try {
      await db.dropCollection("users");
      await db.dropCollection("artists");
      await db.dropCollection("albums");
      await db.dropCollection("tracks");
   } catch (err) {
      console.error("Collection were not presented. Skipping drop.")
   }

   const [user1, user2, admin] = await User.create(
      {
         username: "user1",
         password: "123",
         token: nanoid(),
         __v: 0,
         display: "John",
         phone: "+77056783211",
         role: "user"
      },
      {
         username: "user2",
         password: "123",
         token: nanoid(),
         __v: 0,
         display: "Michael",
         phone: "+77773456789",
         role: "user"
      },
      {
         role: "admin",
         username: "admin",
         password: "123",
         display: "Admin",
         phone: "7 (777) 517-77-17",
         token: "-dejiXfaZ5mrVU04ehAzN",
         __v: 0
      }
   );

   const [Adel, Bruce, Lana, Neneh, OneRepublic, Floyd, Collins, Tsoy] = await Artist.create(
      {
         name: "Adel",
         info: "Аде́ль Ло́ри Блу Э́дкинс — британская певица, автор-исполнитель и поэтесса, лауреат 15 премий Грэмми и первый музыкант, сумевший выиграть в номинациях «Альбом года», «Запись года» и «Песня года» дважды. Песня «Skyfall» в её исполнении получила премии «Оскар» и «Золотой глобус».",
         image: "P8XKjTXln95XxkKLvFU0t.jpg",
         __v: 0,
         published: true,
         user: user1._id
      },
      {
         name: "Bruce Springsteen",
         info: "Брюс Фре́дерик Джо́зеф Спри́нгстин — американский певец, автор песен и музыкант. Лидер группы E Street Band. Известен благодаря своим рок-песням с поэтичными текстами, основной темой которых является его родина, Нью-Джерси.",
         image: "SPNVcE88JJzUS6-nq7sc3.jpg",
         __v: 0,
         published: false,
         user: user1._id
      },
      {
         name: "Lana-del-Rey",
         info: "Ла́на Дель Рей — американская певица, автор песен и поэтесса. Её музыка была отмечена критиками за кинематографический стиль, озабоченность трагическими отношениями и меланхолией, а также за отсылки к американской поп-культуре, в частности, 1950-х и 1960-х годов",
         image: "elUUjNCInovQfmLLHpR06.jpg",
         __v: 0,
         published: false,
         user: user1._id
      },
      {
         name: "Neneh Cherry",
         info: "Нене Мэрианн Карлссон — шведская певица, поэт, композитор и рэпер, дважды номинированная на премию Грэмми и MTV Europe Music Awards. Черри — фамилия приёмного отца и просто звучный псевдоним.",
         image: "TZ-Uwf_P1l31JwR3zHcIT.png",
         __v: 0,
         published: true,
         user: user1._id
      },
      {
         name: "OneRepublic",
         info: "OneRepublic — американская поп-рок группа из Колорадо-Спрингс, известность которой принес сингл «Apologize», ставший в США трижды платиновым и достигший третьего места в хит-параде Великобритании 11 ноября 2007 года.",
         image: "CR3EfLzRUvDBjjRXN6mIM.jpg",
         __v: 0,
         published: true,
         user: user1._id
      },
      {
         name: "Pink Floyd",
         info: "Pink Floyd — британская рок-группа, знаменитая своими продолжительными композициями и объединёнными в тематические сюиты песнями, звуковыми экспериментами, философскими текстами, дизайном обложек альбомов и грандиозными концертными шоу.",
         image: "quB5G58ZGWN0pbVq17VKb.jpg",
         __v: 0,
         published: true,
         user: user2._id
      },
      {
         name: "Phil Collins",
         info: "Фил Ко́ллинз LVO — английский рок/поп певец, барабанщик и автор песен, актёр, продюсер. Получил известность как участник рок-группы Genesis, затем сделал впечатляющую сольную карьеру, продав свыше 150 миллионов экземпляров своих альбомов. Среди его наград — «Оскар» за лучшую песню к мультфильму «Тарзан».",
         image: "y9hGfge-5xnKbbHVv-lpY.jpeg",
         __v: 0,
         published: true,
         user: user2._id
      },
      {
         published: true,
         name: "Виктор Цой",
         info: "Ви́ктор Ро́бертович Цой — советский рок-музыкант, автор песен, художник и актёр. Основатель и лидер рок-группы «Кино», в которой пел, играл на гитаре и являлся автором песен. Помимо музыкальной деятельности, Цой снялся в нескольких фильмах. Лучший актёр 1989 года по версии журнала «Советский экран».",
         user:  user2._id,
         image: "XUd4yqD02EIzBb9DDuz5r.jpg",
         __v: 0
      }
   );



   const [Momentary, Adel21, Seriously, Wall, Sun, Group] = await Album.create(
      {
         name: "A Momentary Lapse of Reason",
         year: "1987",
         artist: Floyd._id,
         image: "n4eNH4_b4J5kpU-bf6UUW.jpg",
         __v: 0,
         published: true,
         user:  user2._id,
         info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur ea exercitationem fugit quibusdam quis sequi vero. Eligendi minus, vero! A deserunt ducimus, eaque neque porro voluptatum. Accusamus deserunt illum officia sunt. Animi delectus dolore dolorem eos error harum illum impedit incidunt iste maxime numquam, pariatur perspiciatis, placeat quas quia quod quos ratione sit suscipit vitae. Ab animi deleniti dicta distinctio iste laborum nostrum possimus. Accusantium architecto aut beatae consectetur cum cupiditate, debitis dicta doloribus error eum impedit itaque laborum laudantium, libero magni maiores minima molestiae nemo nisi nulla odio placeat quam quod sed ullam velit veniam? Eaque eveniet nemo totam.",
      },
      {
         name: "21",
         artist: Adel._id,
         year: "2010",
         image: "pZ9kbB-XqfB0X7iLh6fW1.jpg",
         __v: 0,
         published: true,
         user:  user1._id,
         info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur ea exercitationem fugit quibusdam quis sequi vero. Eligendi minus, vero! A deserunt ducimus, eaque neque porro voluptatum. Accusamus deserunt illum officia sunt. Animi delectus dolore dolorem eos error harum illum impedit incidunt iste maxime numquam, pariatur perspiciatis, placeat quas quia quod quos ratione sit suscipit vitae. Ab animi deleniti dicta distinctio iste laborum nostrum possimus. Accusantium architecto aut beatae consectetur cum cupiditate, debitis dicta doloribus error eum impedit itaque laborum laudantium, libero magni maiores minima molestiae nemo nisi nulla odio placeat quam quod sed ullam velit veniam? Eaque eveniet nemo totam.",
      },
      {
         name: "…But Seriously",
         artist: Collins._id,
         year: "2014",
         image: "qL-XHoV_gdumEBLXDq-Am.jpg",
         __v: 0,
         published: true,
         user:  user2._id,
         info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur ea exercitationem fugit quibusdam quis sequi vero. Eligendi minus, vero! A deserunt ducimus, eaque neque porro voluptatum. Accusamus deserunt illum officia sunt. Animi delectus dolore dolorem eos error harum illum impedit incidunt iste maxime numquam, pariatur perspiciatis, placeat quas quia quod quos ratione sit suscipit vitae. Ab animi deleniti dicta distinctio iste laborum nostrum possimus. Accusantium architecto aut beatae consectetur cum cupiditate, debitis dicta doloribus error eum impedit itaque laborum laudantium, libero magni maiores minima molestiae nemo nisi nulla odio placeat quam quod sed ullam velit veniam? Eaque eveniet nemo totam.",
      },
      {
         name: "The Wall",
         artist: Floyd._id,
         year: "1979",
         image: "uUNaVwhZzbFQ0Ybz6Jz0d.jpg",
         __v: 0,
         published: true,
         user:  user1._id,
         info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur ea exercitationem fugit quibusdam quis sequi vero. Eligendi minus, vero! A deserunt ducimus, eaque neque porro voluptatum. Accusamus deserunt illum officia sunt. Animi delectus dolore dolorem eos error harum illum impedit incidunt iste maxime numquam, pariatur perspiciatis, placeat quas quia quod quos ratione sit suscipit vitae. Ab animi deleniti dicta distinctio iste laborum nostrum possimus. Accusantium architecto aut beatae consectetur cum cupiditate, debitis dicta doloribus error eum impedit itaque laborum laudantium, libero magni maiores minima molestiae nemo nisi nulla odio placeat quam quod sed ullam velit veniam? Eaque eveniet nemo totam.",
      },
      {
         published: true,
         name: "Звезда по имени Солнце",
         info: "«Звезда́ по и́мени Со́лнце» — седьмой студийный альбом советской рок-группы «Кино», вышедший 29 августа 1989 года. Последний прижизненный альбом Виктора Цоя. Запись чернового варианта альбома происходила у Георгия Гурьянова, где располагалась домашняя студия группы.",
         year: "1989",
         artist: Tsoy._id,
         user:  user2._id,
         image: "2-EJF1uTWDA_JAFc-kXRs.jpg",
         __v: 0
      },
      {
         published: true,
         name: "Группа крови",
         info: "«Гру́ппа кро́ви» — шестой студийный альбом советской рок-группы «Кино», вышедший 5 января 1988 года. Альбом получил широкую известность как в Советском Союзе, так и за рубежом. Выход альбома принёс группе быстрый рост популярности, частые приглашения из разных стран и огромное число поклонников.",
         year: "1988",
         artist: Tsoy._id,
         user:  user2._id,
         image: "vfIBGWOLFV29H-0hJZb5c.jpg",
         __v: 0
      }
   );


   const [] = await Track.create(
      {
         published: false,
         name: "Learning To Fly",
         album: Momentary._id,
         duration: "5:56",
         trackNumber: "1",
         trackLink: "nVhNCTH8pDs",
         user: user2._id,
         image: "Mq47f-BP1LeWe7Hcb8DDm.jpg",
         __v: 0
      },
      {
         published: false,
         name: "On the Turning Away",
         album: Momentary._id,
         duration: "05:34",
         trackNumber: "2",
         trackLink: "EMy34qhQe4",
         user: user2._id,
         image: "l42FhXLzd2HvwmVbWHcNP.jpg",
         __v: 0
      },
      {
         published: false,
         name: "Dogs of war",
         album: Momentary._id,
         duration: "04:55",
         trackNumber: "3",
         trackLink: "XpTXHhMa_YQ",
         user: user2._id,
         image: "S_R9gaD_vH612LD_VXRUl.jpg",
         __v: 0
      },
      {
         published: false,
         name: "Someone Like You",
         album: Adel21._id,
         duration: "05:45",
         trackNumber: "1",
         trackLink: "hLQl3WQQoQ0",
         user: user1._id,
         image: "g6d1DVimCCPcu1HcdM9Sb.jpg",
         __v: 0
      },
      {
         published: false,
         name: "Rolling in the Deep",
         album: Adel21._id,
         duration: "04:57",
         trackNumber: "2",
         trackLink: "rYEDA3JcQqw",
         user: user1._id,
         image: "mnAts3hvE-CLDoOTaNPkY.jpg",
         __v: 0
      },
      {
         published: false,
         name: "Another Day in Paradise",
         album: Seriously._id,
         duration: "04:17",
         trackNumber: "1",
         trackLink: "Qt2mbGP6vFI",
         user: user2._id,
         image: "0zNWwcKcXNIzhs_GnXENv.jpg",
         __v: 0
      },
      {
         published: false,
         name: "Heat on the Street",
         album: Seriously._id,
         duration: "05:07",
         trackNumber: "2",
         trackLink: "SKXoLItfo8I",
         user: user2._id,
         image: "BIyktQ3PiKRVhz5uXJ-FP.jpg",
         __v: 0
      },
      {
         published: false,
         name: "Goodbye Blue Sky",
         album: Wall._id,
         duration: "04:45",
         trackNumber: "1",
         trackLink: "MJUuDoRZpyU",
         user: user1._id,
         image: "vVcvO1moGl503JgnrBqla.jpg",
         __v: 0
      },
      {
         published: false,
         name: "Песня без слов",
         album: Sun._id,
         duration: "5:56",
         trackNumber: "1",
         trackLink: "0T-nBNIBbtY",
         user: user2._id,
         image: "PbjHi9_Lh3HUvRDZh3HUC.jpg",
         __v: 0
      },
      {
         published: false,
         name: "Стук",
         album: Sun._id,
         duration: "4:59",
         trackNumber: "2",
         trackLink: "6dXP4OndfRU",
         user: user2._id,
         image: "xEfd-bYf_oBx1Cq0rzObl.jpg",
         __v: 0
      },
      {
         published: false,
         name: "Звезда по имени Солнце",
         album: Sun._id,
         duration: "5:05",
         trackNumber: "3",
         trackLink: "jQV5VXfKDYc",
         user: user2._id,
         image: "VZRV87p6jN06fvIz6_Bpj.jpg",
         __v: 0
      },
      {
         published: false,
         name: "Группа крови",
         album: Group._id,
         duration: "4:42",
         trackNumber: "1",
         trackLink: "xKpzH5bxYsk",
         user: user2._id,
         image: "HrVxucU-0PEGZSHkOBvgQ.jpg",
         __v: 0
      },
      {
         published: false,
         name: "Легенда",
         album: Group._id,
         duration: "5:16",
         trackNumber: "2",
         trackLink: "yi2d67AXEVs",
         user: user2._id,
         image: "yLobIjcc4K-YSZ9JGVf0N.jpg",
         __v: 0
      }
   );


   await db.close();

});
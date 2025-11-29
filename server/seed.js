const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const { db, bucket } = require("./firebaseAdmin");

const seedData = {
  consularServices: [
    {
      icon: "fa-solid fa-passport",
      image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80",
      attachmentUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80",
      attachmentType: "image",
      fileName: "passport.jpg",
      i18n: {
        en: {
          name: "Passport Renewal",
          details: "Renew your Sudanese passport at our embassy. Required documents: expired passport, two photos, national ID, and completed application form. Processing time: 7-10 business days. Fee: 150 RON."
        },
        ro: {
          name: "Reînnoire Pașaport",
          details: "Reînnoiți-vă pașaportul sudanez la ambasada noastră. Documente necesare: pașaport expirat, două fotografii, buletin, și formular de cerere completat. Timp de procesare: 7-10 zile lucrătoare. Taxă: 150 RON."
        },
        ar: {
          name: "تجديد جواز السفر",
          details: "جدد جواز سفرك السوداني في سفارتنا. المستندات المطلوبة: جواز السفر المنتهي، صورتان، البطاقة الوطنية، ونموذج الطلب المكتمل. وقت المعالجة: 7-10 أيام عمل. الرسوم: 150 ليو روماني."
        }
      }
    },
    {
      icon: "fa-solid fa-baby",
      image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80",
      attachmentUrl: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80",
      attachmentType: "image",
      fileName: "birth-certificate.jpg",
      i18n: {
        en: {
          name: "Birth Certificate Registration",
          details: "Register your child's birth and obtain an official Sudanese birth certificate. Required: hospital birth certificate, parents' passports, marriage certificate, and proof of address. Processing: 14 days."
        },
        ro: {
          name: "Înregistrare Certificat de Naștere",
          details: "Înregistrați nașterea copilului dumneavoastră și obțineți un certificat de naștere sudanez oficial. Necesare: certificat de naștere spital, pașapoartele părinților, certificat de căsătorie, și dovadă de domiciliu. Procesare: 14 zile."
        },
        ar: {
          name: "تسجيل شهادة الميلاد",
          details: "سجل ميلاد طفلك واحصل على شهادة ميلاد سودانية رسمية. المطلوب: شهادة ميلاد المستشفى، جوازات سفر الوالدين، شهادة الزواج، وإثبات العنوان. المعالجة: 14 يومًا."
        }
      }
    }
  ],
  news: [
    {
      title: "New Passport Services Available",
      summary: "The Embassy is pleased to announce enhanced passport services including expedited processing and online appointment booking. Citizens can now renew their passports within 5-7 business days.",
      tag: "Update",
      image: "https://images.unsplash.com/photo-1569098644584-210bcd375b59?w=800&q=80",
      attachmentUrl: "https://images.unsplash.com/photo-1569098644584-210bcd375b59?w=800&q=80",
      attachmentType: "image",
      fileName: "passport-services.jpg",
      i18n: {
        en: {
          title: "New Passport Services Available",
          summary: "The Embassy is pleased to announce enhanced passport services including expedited processing and online appointment booking. Citizens can now renew their passports within 5-7 business days.",
          tag: "Update"
        },
        ro: {
          title: "Noi servicii de pașapoarte disponibile",
          summary: "Ambasada este încântată să anunțe servicii îmbunătățite de pașapoarte, incluzând procesare accelerată și programare online. Cetățenii pot acum să își reînnoiască pașapoartele în 5-7 zile lucrătoare.",
          tag: "Actualizare"
        },
        ar: {
          title: "خدمات جوازات السفر الجديدة متاحة",
          summary: "تسر السفارة أن تعلن عن خدمات جوازات السفر المحسّنة بما في ذلك المعالجة السريعة والحجز عبر الإنترنت. يمكن للمواطنين الآن تجديد جوازات سفرهم خلال 5-7 أيام عمل.",
          tag: "تحديث"
        }
      }
    },
    {
      title: "Sudan Independence Day Celebration 2025",
      summary: "Join us on January 1st, 2025, to celebrate Sudan's Independence Day. The Embassy will host a cultural event featuring traditional music, Sudanese cuisine, and exhibitions showcasing our nation's rich heritage.",
      tag: "Event",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
      attachmentUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
      attachmentType: "image",
      fileName: "independence-day.jpg",
      i18n: {
        en: {
          title: "Sudan Independence Day Celebration 2025",
          summary: "Join us on January 1st, 2025, to celebrate Sudan's Independence Day. The Embassy will host a cultural event featuring traditional music, Sudanese cuisine, and exhibitions showcasing our nation's rich heritage.",
          tag: "Event"
        },
        ro: {
          title: "Celebrarea Zilei Independenței Sudanului 2025",
          summary: "Alăturați-vă nouă pe 1 ianuarie 2025 pentru a sărbători Ziua Independenței Sudanului. Ambasada va găzdui un eveniment cultural cu muzică tradițională, bucătărie sudaneză și expoziții care prezintă bogata moștenire a națiunii noastre.",
          tag: "Eveniment"
        },
        ar: {
          title: "احتفال يوم استقلال السودان 2025",
          summary: "انضموا إلينا في 1 يناير 2025 للاحتفال بيوم استقلال السودان. ستستضيف السفارة حدثًا ثقافيًا يضم موسيقى تقليدية ومأكولات سودانية ومعارض تعرض تراث أمتنا الغني.",
          tag: "حدث"
        }
      }
    }
  ],
  alerts: [
    {
      message: "Embassy Closed for New Year - The embassy will be closed from December 30, 2024, to January 2, 2025. Emergency services remain available at +40-XXX-XXX-XXX.",
      level: "info",
      active: true,
      attachmentUrl: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80",
      attachmentType: "image",
      fileName: "embassy-closure.jpg",
      i18n: {
        en: {
          message: "Embassy Closed for New Year - The embassy will be closed from December 30, 2024, to January 2, 2025. Emergency services remain available at +40-XXX-XXX-XXX."
        },
        ro: {
          message: "Ambasada închisă pentru Anul Nou - Ambasada va fi închisă de la 30 decembrie 2024 până la 2 ianuarie 2025. Serviciile de urgență rămân disponibile la +40-XXX-XXX-XXX."
        },
        ar: {
          message: "السفارة مغلقة بمناسبة رأس السنة - ستكون السفارة مغلقة من 30 ديسمبر 2024 إلى 2 يناير 2025. خدمات الطوارئ متاحة على +40-XXX-XXX-XXX."
        }
      }
    },
    {
      message: "Document Authentication Changes - Starting February 1st, all document authentication requests must be submitted online through our new portal. Walk-in submissions will no longer be accepted.",
      level: "warning",
      active: true,
      attachmentUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
      attachmentType: "image",
      fileName: "document-authentication.jpg",
      i18n: {
        en: {
          message: "Document Authentication Changes - Starting February 1st, all document authentication requests must be submitted online through our new portal. Walk-in submissions will no longer be accepted."
        },
        ro: {
          message: "Modificări autentificare documente - Începând cu 1 februarie, toate cererile de autentificare a documentelor trebuie trimise online prin noul nostru portal. Nu se mai acceptă depuneri directe."
        },
        ar: {
          message: "تغييرات توثيق المستندات - ابتداءً من 1 فبراير، يجب تقديم جميع طلبات توثيق المستندات عبر الإنترنت من خلال بوابتنا الجديدة. لن يتم قبول الطلبات المباشرة."
        }
      }
    }
  ]
};

const settingsData = {
  header: {
    phone: "+40 21 123 4567",
    email: "info@sudanembassy.ro"
  },
  receiveEmail: "embassy@sudanembassy.ro",
  address: "123 Diplomatic Street, Sector 1, Bucharest, Romania",
  hero: {
    title: "Embassy of the Republic of Sudan",
    subtitle: "Bucharest, Romania",
    cta1: "Book Appointment",
    cta2: "Consular Services"
  },
  hours: {
    monThu: "9:00 AM - 4:00 PM",
    fri: "9:00 AM - 1:00 PM"
  },
  statusBar: {
    status: "Open today: 9:00 AM - 4:00 PM",
    holiday: "today",
    nextAppointment: "tomorrow"
  },
  emergency: {
    phone: "+40 722 123 456",
    note: "This number is for genuine emergencies only"
  },
  contacts: {
    address: ["fa-solid fa-location-dot", "123 Diplomatic Street, Sector 1, Bucharest, Romania"],
    phone: ["fa-solid fa-phone", "+40 21 123 4567"],
    email: ["fa-solid fa-envelope", "info@sudanembassy.ro"]
  },
  map: {
    lat: 44.4467127,
    lng: 26.1035968,
    placeLink: "https://www.google.com/maps/place/Ambasada+Republicii+Sudan/@44.447707,26.1031946,17.77z/data=!4m6!3m5!1s0x40b1ff8fd7ba51a9:0x1bea18766dc4de4c!8m2!3d44.4467127!4d26.1035968!16s%2Fg%2F11vbypp9cb?entry=ttu"
  },
  promoSlides: {
    slide1: {
      title: "Hidden Treasures Cultural Tourism",
      subtitle: "Discover the ancient pyramids of Meroë",
      cta: "Learn More",
      href: "https://whc.unesco.org/en/list/1336/",
      image: "https://images.theconversation.com/files/406165/original/file-20210614-47555-wwdvzo.jpg?ixlib=rb-4.1.0&rect=0%2C287%2C3125%2C1562&q=45&auto=format&w=1356&h=668&fit=crop"
    },
    slide2: {
      title: "Sudan Police Electronic Reporting",
      subtitle: "Report incidents online through the official platform",
      cta: "Visit Portal",
      href: "#",
      image: "https://cdn.pixabay.com/video/2024/08/26/228297_tiny.jpg"
    }
  },
  i18n: {
    en: {
      address: "123 Diplomatic Street, Sector 1, Bucharest, Romania",
      hero: {
        title: "Embassy of the Republic of Sudan",
        subtitle: "Bucharest, Romania",
        cta1: "Book Appointment",
        cta2: "Consular Services"
      },
      hours: {
        monThu: "9:00 AM - 4:00 PM",
        fri: "9:00 AM - 1:00 PM"
      },
      statusBar: {
        status: "Open today: 9:00 AM - 4:00 PM",
        holiday: "Closed for Holiday",
        nextAppointment: "Next available: Tomorrow"
      },
      emergency: {
        note: "This number is for genuine emergencies only"
      },
      contacts: {
        address: "123 Diplomatic Street, Sector 1, Bucharest, Romania",
        phone: "+40 21 123 4567",
        email: "info@sudanembassy.ro"
      },
      promoSlides: {
        slide1: {
          title: "Hidden Treasures Cultural Tourism",
          subtitle: "Discover the ancient pyramids of Meroë",
          cta: "Learn More"
        },
        slide2: {
          title: "Sudan Police Electronic Reporting",
          subtitle: "Report incidents online through the official platform",
          cta: "Visit Portal"
        }
      }
    },
    ro: {
      address: "Strada Diplomatică 123, Sectorul 1, București, România",
      hero: {
        title: "Ambasada Republicii Sudan",
        subtitle: "București, România",
        cta1: "Programează-te",
        cta2: "Servicii Consulare"
      },
      hours: {
        monThu: "9:00 - 16:00",
        fri: "9:00 - 13:00"
      },
      statusBar: {
        status: "Deschis astăzi: 9:00 - 16:00",
        holiday: "Închis pentru sărbătoare",
        nextAppointment: "Următoarea disponibilitate: Mâine"
      },
      emergency: {
        note: "Acest număr este doar pentru urgențe reale"
      },
      contacts: {
        address: "Strada Diplomatică 123, Sectorul 1, București, România",
        phone: "+40 21 123 4567",
        email: "info@sudanembassy.ro"
      },
      promoSlides: {
        slide1: {
          title: "Comori Ascunse - Turism Cultural",
          subtitle: "Descoperă piramidele antice din Meroë",
          cta: "Află mai multe"
        },
        slide2: {
          title: "Platformă Electronică a Poliției Sudaneze",
          subtitle: "Raportează incidente online prin platforma oficială",
          cta: "Vizitează portalul"
        }
      }
    },
    ar: {
      address: "شارع الدبلوماسية 123، القطاع 1، بوخارست، رومانيا",
      hero: {
        title: "سفارة جمهورية السودان",
        subtitle: "بوخارست، رومانيا",
        cta1: "احجز موعداً",
        cta2: "الخدمات القنصلية"
      },
      hours: {
        monThu: "9:00 صباحاً - 4:00 مساءً",
        fri: "9:00 صباحاً - 1:00 مساءً"
      },
      statusBar: {
        status: "مفتوح اليوم: 9:00 صباحاً - 4:00 مساءً",
        holiday: "مغلق للعطلة",
        nextAppointment: "التوفر التالي: غداً"
      },
      emergency: {
        note: "هذا الرقم للطوارئ الحقيقية فقط"
      },
      contacts: {
        address: "شارع الدبلوماسية 123، القطاع 1، بوخارست، رومانيا",
        phone: "+40 21 123 4567",
        email: "info@sudanembassy.ro"
      },
      promoSlides: {
        slide1: {
          title: "كنوز خفية - السياحة الثقافية",
          subtitle: "اكتشف أهرامات مروي القديمة",
          cta: "اعرف المزيد"
        },
        slide2: {
          title: "منصة الإبلاغ الإلكترونية للشرطة السودانية",
          subtitle: "أبلغ عن الحوادث عبر الإنترنت من خلال المنصة الرسمية",
          cta: "زر البوابة"
        }
      }
    }
  }
};

async function deleteAllFiles() {
  console.log("Deleting all files from storage bucket...");
  try {
    const [files] = await bucket.getFiles();
    for (const file of files) {
      await file.delete();
      console.log(`  Deleted: ${file.name}`);
    }
    console.log(`✓ Deleted ${files.length} files from storage`);
  } catch (error) {
    console.error("Error deleting files:", error.message);
  }
}

async function clearCollection(collectionName) {
  console.log(`Clearing collection: ${collectionName}...`);
  try {
    const snapshot = await db.collection(collectionName).get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    console.log(`✓ Cleared ${snapshot.size} documents from ${collectionName}`);
  } catch (error) {
    console.error(`Error clearing ${collectionName}:`, error.message);
  }
}

async function seedCollection(collectionName, data) {
  console.log(`Seeding collection: ${collectionName}...`);
  try {
    for (const item of data) {
      const docData = {
        ...item,
        createdAt: new Date().toISOString(),
      };
      await db.collection(collectionName).add(docData);
    }
    console.log(`✓ Seeded ${data.length} documents to ${collectionName}`);
  } catch (error) {
    console.error(`Error seeding ${collectionName}:`, error.message);
  }
}

async function seed() {
  console.log("\n🌱 Starting database seed...\n");

  // Delete all files from storage bucket
  await deleteAllFiles();

  // Clear all collections
  await clearCollection("consularServices");
  await clearCollection("news");
  await clearCollection("alerts");
  await clearCollection("forms");
  await clearCollection("appointments");
  await clearCollection("submissions");

  // Seed data
  await seedCollection("consularServices", seedData.consularServices);
  await seedCollection("news", seedData.news);
  await seedCollection("alerts", seedData.alerts);

  // Seed settings
  console.log("Seeding settings...");
  try {
    await db.collection("settings").doc("site").set(settingsData);
    console.log("✓ Settings seeded successfully");
  } catch (error) {
    console.error("Error seeding settings:", error.message);
  }

  console.log("\n✅ Seed completed successfully!\n");
  process.exit(0);
}

// Run seed
seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});

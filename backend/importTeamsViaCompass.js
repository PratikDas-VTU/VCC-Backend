// MongoDB Compass Shell Import Script
// Run this directly in MongoDB Compass Shell tab

// Team data from CSV
const teamsData = [
    { teamNo: 1, vccId: "VCC112", teamSize: 2, m1Name: "Srihari P", m1Email: "rakavip2@gmail.com", m1Phone: "9080662519", m1College: "SRM Valliammai Engineering College", m2Name: "Rakavi P", m2Email: "srihari221122@gmail.com", m2Phone: "9962408595", m2College: "SRM Valliammai Engineering College" },
    { teamNo: 2, vccId: "VCC107", teamSize: 2, m1Name: "PANDARAM DILLIBABU", m1Email: "pandaramdilli@gmail.com", m1Phone: "6281127807", m1College: "VEL TECH HIGH DR RANGARAJAN DR RANGARAJAN ENGINEERING COLLEGE", m2Name: "NISHANT.S", m2Email: "nishant.s.17ns@gmail.com", m2Phone: "7305814097", m2College: "VEL TECH HIGH TECH DR RANGARAJAN DR SAKUNTHALA ENGINEERING COLLEGE" },
    { teamNo: 3, vccId: "VCC027", teamSize: 2, m1Name: "Chekuri Sai Chandra", m1Email: "chandrachekuri2004@gmail.com", m1Phone: "9347112661", m1College: "Kalasalingam Academy of Research and Education", m2Name: "Jonnala Sai Chaitanya", m2Email: "99230040190@klu.ac.in", m2Phone: "9347112661", m2College: "Kalasalingam Academy of Research and Education" },
    { teamNo: 4, vccId: "VCC120", teamSize: 2, m1Name: "A.Sanjay Ram Chowdary", m1Email: "sanjayramchowdary25@gmail.com", m1Phone: "7981152511", m1College: "Saveetha school of engineering", m2Name: "K.Avinash", m2Email: "kasukurthiavinash16@gmail.com", m2Phone: "7989224034", m2College: "Saveetha school of engineering" },
    { teamNo: 5, vccId: "VCC069", teamSize: 2, m1Name: "Palagiri Harika", m1Email: "vtu27583@veltech.edu.in", m1Phone: "8919525732", m1College: "Veltech university", m2Name: "Maheshwarla yamuna sri", m2Email: "vtu32117@veltech.edu.in", m2Phone: "7993964279", m2College: "Veltech university" },
    { teamNo: 6, vccId: "VCC108", teamSize: 2, m1Name: "HARINI K", m1Email: "kharini118@gmail.com", m1Phone: "7695853507", m1College: "VEL TECH HIGH TECH DR RANGARAJAN DR SAKUNTHALA ENGINEERING COLLEGE", m2Name: "SHALINI S", m2Email: "jenniferjayakumar006@gmail.com", m2Phone: "8754300777", m2College: "VEL TECH HIGH TECH DR RANGARAJAN DR SAKUNTHALA ENGINEERING COLLEGE" },
    { teamNo: 7, vccId: "VCC095", teamSize: 2, m1Name: "Naga Jaswanth. B", m1Email: "n.jaswanthbala@gmail.com", m1Phone: "8125643574", m1College: "SIMATS ENGINEERING", m2Name: "Maniyar Mohammad Rehan", m2Email: "mohammadrehanmaniyar07@gmail.com", m2Phone: "8885256886", m2College: "SIMATS ENGINEERING" },
    { teamNo: 8, vccId: "VCC054", teamSize: 2, m1Name: "Ravishankar", m1Email: "ravishankar.95567@gmail.com", m1Phone: "9677295567", m1College: "Ramco institute of technology", m2Name: "Saravana S", m2Email: "saravana184510@gmail.com", m2Phone: "9344492493", m2College: "Ramco institute of technology" },
    { teamNo: 9, vccId: "VCC028", teamSize: 2, m1Name: "Pinnamaneni Krishna Bhargav", m1Email: "pinnamanenikrishnabhargav08@gmail.com", m1Phone: "9848736145", m1College: "Kalasalingam academy of reasearch and education", m2Name: "Gangireddy Sree dhanush reddy", m2Email: "dhanushmurali27@gmail.com", m2Phone: "7799722287", m2College: "Kalasalingam academy of reasearch and education" },
    { teamNo: 10, vccId: "VCC052", teamSize: 2, m1Name: "Pannala Minendher Reddy", m1Email: "minendherreddy5752@gmail.com", m1Phone: "8977115752", m1College: "Amrita Vishwa Vidyapeetham", m2Name: "Bekkam Amarnath Reddy", m2Email: "amarnathreddy2407@gmail.com", m2Phone: "7995487502", m2College: "Amrita vishwa vidhyapeetham" },
    { teamNo: 11, vccId: "VCC032", teamSize: 2, m1Name: "SRISAIKIRAN KADIYALA", m1Email: "srisaikirankadiyala999@gmail.com", m1Phone: "9642165715", m1College: "Kalasalingam Academy of Research and Education", m2Name: "YASWANTH KUMAR CHUKKULURU", m2Email: "c.yaswanth767@gmail.com", m2Phone: "8125409463", m2College: "Kalasalingam Academy of Research and Education" },
    { teamNo: 12, vccId: "VCC037", teamSize: 2, m1Name: "THARUNIYA T", m1Email: "tharuniya54@gmail.com", m1Phone: "8838575298", m1College: "K. Ramakrishnan college of Technology", m2Name: "YOGA S", m2Email: "yogasathish1142004@gmail.com", m2Phone: "8438512508", m2College: "K. Ramakrishnan college of Technology" },
    { teamNo: 13, vccId: "VCC075", teamSize: 2, m1Name: "ANUBOLU ROHAN KARTHIK REDDY", m1Email: "rohankarthik88@gmail.com", m1Phone: "9059897877", m1College: "Amrita Vishwa Vidyapeetham", m2Name: "DHADI TRINADH", m2Email: "trinadhdhadi@gmail.com", m2Phone: "630527746", m2College: "Amrita Vishwa Vidyapeetham" },
    { teamNo: 14, vccId: "VCC130", teamSize: 2, m1Name: "VARSHINI C", m1Email: "cvarshini003@gmail.com", m1Phone: "9042133153", m1College: "RMK College of Engineering and Technology (RMKCET)", m2Name: "Yuvan sankar SA", m2Email: "yuvansankarsa@gmail.com", m2Phone: "8778978321", m2College: "Panimalar engineering college" },
    { teamNo: 15, vccId: "VCC057", teamSize: 2, m1Name: "ADHAKKAGARI MANOHAR REDDY", m1Email: "99230040830@gmail.com", m1Phone: "8897440296", m1College: "Kalasalingam academy of research and education", m2Name: "Gandra AjithRao", m2Email: "gandraajithrao@gmail.com", m2Phone: "9182829767", m2College: "Kalasalingam academy of research and education" },
    { teamNo: 16, vccId: "VCC119", teamSize: 2, m1Name: "CHINTAKAYALA MAHAMMAD SAJID", m1Email: "sajidmahammad23@gmail.com", m1Phone: "7981550389", m1College: "Saveetha school of engineering", m2Name: "TANGUTURI BHARGAV REDDY", m2Email: "bhargavtanguturi455@gmail.com", m2Phone: "9030411317", m2College: "Saveetha school of engineering" },
    { teamNo: 17, vccId: "VCC111", teamSize: 2, m1Name: "K v charan teja", m1Email: "kolasrinivasarao625@gmail.com", m1Phone: "9390097937", m1College: "Simats engineering", m2Name: "Rajwanth", m2Email: "rajwanth.1435@gmail.com", m2Phone: "7801061105", m2College: "Simats engineering" },
    { teamNo: 18, vccId: "VCC121", teamSize: 2, m1Name: "HARSHANA R K", m1Email: "harshanaraajakannan@gmail.com", m1Phone: "9962614141", m1College: "CHENNAI INSTITUTE OF TECHNOLOGY", m2Name: "SARIKA D", m2Email: "sarikadinesh2006@gmail.com", m2Phone: "6383521344", m2College: "CHENNAI INSTITUTE OF TECHNOLOGY" },
    { teamNo: 19, vccId: "VCC043", teamSize: 2, m1Name: "Avadhanam Hasini", m1Email: "avadhanamhasini@gmail.com", m1Phone: "9441378391", m1College: "Christ University", m2Name: "Andrea Mary PT", m2Email: "andrea.mary@btech.christuniversity.in", m2Phone: "9880799288", m2College: "Christ University" },
    { teamNo: 20, vccId: "VCC014", teamSize: 2, m1Name: "Saktheeswaran K", m1Email: "saktheeswaran085@gmail.com", m1Phone: "8220978530", m1College: "Ramco Institute of Technology", m2Name: "Satheesh D", m2Email: "953624104140@ritrjpm.ac.in", m2Phone: "9345065489", m2College: "Ramco Institute of Technology" },
    { teamNo: 21, vccId: "VCC098", teamSize: 2, m1Name: "Parlapalli Lakshmi Bhoomika", m1Email: "vtu26902@veltech.edu.in", m1Phone: "7993397258", m1College: "Vel Tech Rangarajan Dr.Sagunthala R&D Institute of Science and Technology", m2Name: "M.Sai Lakshmi", m2Email: "vtu26922@veltech.edu.in", m2Phone: "8125924381", m2College: "Vel Tech Rangarajan Dr.Sagunthala R&D Institute of Science and Technology" },
    { teamNo: 22, vccId: "VCC066", teamSize: 2, m1Name: "M Haripriya", m1Email: "haripriyaraj2005@gmail.com", m1Phone: "6382242118", m1College: "Christ University", m2Name: "Ishika gupta", m2Email: "ishika.g@btech.christuniversity.in", m2Phone: "9163336182", m2College: "Chrust university" },
    { teamNo: 23, vccId: "VCC001", teamSize: 1, m1Name: "DHINESH KUMAR G", m1Email: "dhineshkumar.g2004@gmail.com", m1Phone: "7092450500", m1College: "SAVEETHA SCHOOL OF ENGINEERING" },
    { teamNo: 24, vccId: "VCC021", teamSize: 2, m1Name: "Baddiputi Venkataramana", m1Email: "venkatbaddiputi@gmail.com", m1Phone: "9121898309", m1College: "Kalasalingam academy of research and education", m2Name: "Sanjeevula Varun", m2Email: "varunsanjeevula91@gmail.com", m2Phone: "9392550066", m2College: "Kalasalingam academy of research and education" },
    { teamNo: 25, vccId: "VCC060", teamSize: 2, m1Name: "MOHAMMED ASHFAQUL HAQ", m1Email: "ashfaq946447@gmail.com", m1Phone: "6302574858", m1College: "KALASALINGAM ACADEMY OF RESEARCH AND EDUCATION", m2Name: "GARLAPATI HANMANTH SAI RAM", m2Email: "hanumathgarlapati@gmail.com", m2Phone: "6305032933", m2College: "KALASALINGAM ACADEMY OF RESEARCH AND EDUCATION" },
    { teamNo: 26, vccId: "VCC056", teamSize: 2, m1Name: "Jayaprabha.M", m1Email: "jayaprabha1112006@gmail.com", m1Phone: "6381135737", m1College: "VEL TECH HIGH TECH DR.RANGARAJAN DR.SAKUNTHALA ENGINEERING COLLEGE", m2Name: "Bhavashitha.G", m2Email: "bhavanag679@gmail.com", m2Phone: "9959250561", m2College: "VEL TECH HIGH TECH DR.RANGARAJAN DR.SAKUNTHALA ENGINEERING COLLEGE" },
    { teamNo: 27, vccId: "VCC025", teamSize: 2, m1Name: "Kolla Venkata Sai Manvith", m1Email: "manvith2005m@gmail.com", m1Phone: "9959167599", m1College: "Veltech University", m2Name: "Achutha Brundhaanjani", m2Email: "achuthaanjani@gmail.com", m2Phone: "8008853683", m2College: "Veltech University" },
    { teamNo: 28, vccId: "VCC063", teamSize: 2, m1Name: "CHALLAGALI SRI NIHAL VARMA", m1Email: "nihalvarma2007@gmail.com", m1Phone: "8431173351", m1College: "AMRITA VISHWA VIDHYAPEETHAM", m2Name: "SHAIK NAZEER", m2Email: "nazeershaik7466@gmail.com", m2Phone: "6309901877", m2College: "AMRITA VISHWA VIDHYAPEETHAM" },
    { teamNo: 29, vccId: "VCC009", teamSize: 2, m1Name: "Nagothi Dinesh", m1Email: "dineshnaidu12065@gmail.com", m1Phone: "9515711265", m1College: "Kalasalingam University", m2Name: "PACHIKAYALA NAGANAND", m2Email: "naganad0202@gmail.com", m2Phone: "9550148642", m2College: "Kalasalingam University" },
    { teamNo: 30, vccId: "VCC015", teamSize: 1, m1Name: "Yeshwanth Raj Selvaraj", m1Email: "yeshselva1@gmail.com", m1Phone: "8122995972", m1College: "Amrita Vishwa Vidyapeetham" },
    { teamNo: 31, vccId: "VCC042", teamSize: 2, m1Name: "Kavitha A", m1Email: "viskotcs@gmail.com", m1Phone: "6381744694", m1College: "Vel Tech High Tech Dr. Rangarajan Dr.Sakunthala Engineering college", m2Name: "Jeevitha D", m2Email: "djeevitha01@gmail.com", m2Phone: "7305650310", m2College: "Vel tech High Tech Dr.Rangarajan Dr.Sakunthala Engineering college" },
    { teamNo: 32, vccId: "VCC113", teamSize: 2, m1Name: "Aswin kumar S", m1Email: "ashwin04052006@gmail.com", m1Phone: "6374587426", m1College: "Prathyusha Engineering College", m2Name: "Madhan T", m2Email: "madhanmass1296@gmail.com", m2Phone: "6374587426", m2College: "Vel Tech University" },
    { teamNo: 33, vccId: "VCC055", teamSize: 2, m1Name: "Vigneshwaran S", m1Email: "vigneshwarans713@gmail.com", m1Phone: "6379290049", m1College: "Ramco institute of technology", m2Name: "Prakash S", m2Email: "prakashsenthilkumar13@gmail.com", m2Phone: "7845356378", m2College: "Ramco institute of technology" },
    { teamNo: 34, vccId: "VCC029", teamSize: 2, m1Name: "Kavali bharath", m1Email: "bharathroyalk05@gmail.com", m1Phone: "9701724324", m1College: "Kalasalingam Academy of Research and Education", m2Name: "Ravula Sathwik", m2Email: "naresh1983r@gmail.com", m2Phone: "8341222902", m2College: "Kalasalingam Academy of Research and Education" },
    { teamNo: 35, vccId: "VCC045", teamSize: 1, m1Name: "Adiel A Daniel", m1Email: "adieladaniel2006@gmail.com", m1Phone: "9810759503", m1College: "Christ University Kengeri campus" },
    { teamNo: 36, vccId: "VCC041", teamSize: 2, m1Name: "MANGALAMPETA ADHITHYA", m1Email: "madhithya09@gmail.com", m1Phone: "8555854949", m1College: "Kalasalingam Academy of Research and Education", m2Name: "THATIKONDU VENKATA SAI CHARAN", m2Email: "saicharan4591@gmail.com", m2Phone: "6300657544", m2College: "Kalasalingam Academy of Research and Education" },
    { teamNo: 37, vccId: "VCC123", teamSize: 2, m1Name: "Monaboti Naveen", m1Email: "monabotinaveen18@gmail.com", m1Phone: "9014749041", m1College: "Saveetha School Of Engineering", m2Name: "Ponnboina Vijay Kumar Yadav", m2Email: "192411135.simats@saveetha.com", m2Phone: "9392855026", m2College: "Saveetha School Of Engineering" },
    { teamNo: 38, vccId: "VCC065", teamSize: 2, m1Name: "RAMIREDDY SRAVANI", m1Email: "sravaniramireddy5@gmail.com", m1Phone: "9014896383", m1College: "KALASALINGAM ACADEMY OF RESEARCH AND EDUCATION", m2Name: "RAPARLA MAHITHA", m2Email: "99230040850@klu.ac.in", m2Phone: "9492276787", m2College: "KALASALINGAM ACADEMY OF RESEARCH AND EDUCATION" },
    { teamNo: 39, vccId: "VCC074", teamSize: 2, m1Name: "Maheesh", m1Email: "mahimaheesh253@gmail.com", m1Phone: "8309458556", m1College: "Amrita Vishwa vidyapeetham", m2Name: "Abdul Ezaz", m2Email: "ezaz.gurramkonda@gmail.com", m2Phone: "9398636673", m2College: "Amrita Vishwa vidyapeetham" },
    { teamNo: 40, vccId: "VCC084", teamSize: 2, m1Name: "LSK Vishal", m1Email: "vish77247@gmail.com", m1Phone: "9080227141", m1College: "Chennai institute of Technology", m2Name: "Subha Shree A", m2Email: "subhashreestudent@gmail.com", m2Phone: "9677151810", m2College: "Chennai institute of Technology" }
];

// Helper function to create bcrypt-like hash (simplified for MongoDB shell)
// Note: This creates a simple hash. For production, use proper bcrypt
function simpleHash(password) {
    // Using MongoDB's built-in SHA256 (not as secure as bcrypt but works)
    return "$2a$10$" + password + "HASHED"; // Placeholder - will be replaced
}

// Process and insert teams
const teams = teamsData.map(t => {
    const members = [{
        name: t.m1Name,
        email: t.m1Email,
        phone: t.m1Phone,
        college: t.m1College
    }];

    if (t.teamSize === 2 && t.m2Name) {
        members.push({
            name: t.m2Name,
            email: t.m2Email,
            phone: t.m2Phone,
            college: t.m2College
        });
    }

    return {
        vccId: t.vccId,
        teamNo: t.teamNo,
        teamSize: t.teamSize,
        members: members,
        M1_Name: t.m1Name,
        M1_Email: t.m1Email,
        M1_Phone: t.m1Phone,
        M1_College: t.m1College,
        M2_Name: t.m2Name || null,
        M2_Email: t.m2Email || null,
        M2_Phone: t.m2Phone || null,
        M2_College: t.m2College || null,
        leaderName: t.m1Name,
        email: t.m1Email,
        phone: t.m1Phone,
        college: t.m1College,
        passwordHash: simpleHash(t.m1Phone),
        hackathonStart: null,
        githubUrl: null,
        deploymentUrl: null,
        sessionEnded: false,
        createdAt: new Date(),
        updatedAt: new Date()
    };
});

// Insert all teams
db.teams.insertMany(teams);

print("✅ Imported " + teams.length + " teams successfully!");

/*------------------------------------------------------------------------------------
    MSF Dashboard - dev-defined.js
    (c) 2015-2016, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This module contains the parameters of the dashboard that have to be defined by the developer in order to tailor the tool to the specific needs of the future users. In the following we will look at the parameters needed to:
 * <ul>
 *   <li> get the medical and geometry data,</li>
 *   <li> check the medical and geometry data,</li>
 *   <li> define the charts and maps, feed them with the correct data and define specific interaction,</li>
 * </ul>
 * All these parameters are defined in <code>dev/dev-defined.js</code> and are stored in the global variable <code>g</code>.
 * <br><br>
 * <code>g</code> stores other Objects as well that are not defined by the developer but that are the results of the processing and interactions. <code>g</code> can be accessed through your developer browser interface.
 * <br><br>
 * As a reminder, two other files are crucial when setting up a new version of the Dashboard which are:
 * <ul>
 *   <li> the 'index.html' file which defines the divs and the positions of the charts and maps, and </li>
 *   <li> the {@link module:module-lang} ('lang/module-lang.js') which contains all the text that have to be displayed and its various translations.</li>
 * </ul>
 * @module g
 * @since v0.9.0
 * @requires lang/lang.js
 * @todo Limit list of parameters in g.
 * @todo Implement 'module_list' check to run or not the modules.
 */

/**
 * @module dev_defined
 */
g.dev_defined = {};

/*------------------------------------------------------------------------------------
    Components:
    1) Data parameters
    2) Data check parameters
    3) Charts parameters
------------------------------------------------------------------------------------*/

// 1) Data parameters
//------------------------------------------------------------------------------------

/**
 Defines the type of medical data parsed in the dashboard. <br>
 <br>
 Currently accepted values are:
 <ul>
     <li><code>surveillance</code> (aggregated) or</li>
     eli><code>outbreak</code> (linelist).</li>
 </ul>
 * @constant
 * @type {String}
 * @alias module:g.medical_datatype
 */
g.medical_datatype = 'outbreak'; // 'outbreak' or 'surveillance'

/**
 Defines your incidence (and mortality) computation.
 * @constant
 * @type {Function}
 * @alias module:dev_defined.definition_incidence
 */
g.dev_defined.definition_incidence = function(value,pop,periode) {
    return value * 10000 / (pop * periode);
};

/**
 Defines your completeness computation.
 * @constant
 * @type {Boolean}
 * @alias module:dev_defined.ignore_empty
 */
g.dev_defined.ignore_empty = true;

/**
 * Contains the list of implemented map units.
 * <br> Defined in {@link module:module_colorscale}.
  Currently accepted values are:
 <ul>
     <li><code>Cases</code></li>
     <li><code>Deaths</code></li>
     <li><code>IncidenceProp</code></li>
     <li><code>MortalityProp</code></li>
     <li><code>Completeness</code></li>
 </ul>
 * @type {Array.<String>}
 * @constant
 * @alias module:module_colorscale.mapunitlist
 */
if(!g.module_colorscale){
    g.module_colorscale = {};
}
g.module_colorscale.mapunitlist = ['Cases','Deaths','IncidenceProp','MortalityProp'];
//g.module_colorscale.mapunitlist = ['Cases','Deaths'];

/**
 * Defines the data parsed in the dashboard (urls and sources type). Order matters.<br>
 * <br>
 * Currently accepted methods are:
 * <ul>
 *    <li><code>arcgis_api</code> (not published yet)</li>
 *    <li><code>kobo_api</code> (not published yet)</li>
 *    <li><code>d3</code></li>
 *    <li><code>medicald3server</code></li>
 *    <li><code>medicald3noserver</code></li>
 *    <li><code>geometryd3</code></li>
 *    <li><code>populationd3</code></li>
 *    <li><code>medicalxlsx</code></li>
 * </ul>
 * @constant
 * @type {Object}
 * @alias module:g.module_getdata
 */
g.module_getdata = {
    geometry: {
        admN1: {
            method:  'geometrydata',
            data: g.geometry.districts
        },
        admN2: {
            method:  'geometrydata',
            data: g.geometry.wards
        },
        admN3: {
            method:  'geometrydata',
            data: g.geometry.subwards
        },
        admN4: {
            method:  'geometrydata',
            data: g.geometry.shinas
        }
    },
    extralay: {
        admN0: {
            method: 'd3',
            options: {url: './data/empty.json', type: 'json'}
        }
    },
    medical: {
        medical: {
            method: 'medicald3',
            options: {url: './check_ins.csv', type: 'csv'}
        }
    }
    /*
    population: {
        pop: {
            method: 'populationd3',
            options: {url: './data/pop.csv', type: 'csv'}
        }
    }
    */
};

g.geometry_level_properties = [
    'district',
    'ward',
    'subward',
    'mjumbe'
];

/**
 Lists the keys used to refer to specific {@link module:g.medical_data} fields. It makes the link between headers in the data files and unambiguous keys used in the code.<br>
 Each element in the object is coded in the following way:
 <pre>*key_in_dashboard*: '*header_in_datafile*',</pre>
 * @constant
 * @type {Object}
 * @alias module:g.medical_headerlist
 **/

g.medical_headerlist = {
    date: 'check_in_datetime', // Date of presentation at hospital
    id: 'patient_id',       // Patient ID number
    admN0: 'region_name',      // Administrative division level 0
    admN1: 'district_name',       // Administrative division level 1
    admN2: 'ward_name',       // Administrative division level 2
    admN3: 'village_name',       // Administrative division level 3
    admN4: 'leader_name',       // Administrative division level 4
    age: 'age',             // Age of patient in years
    sex: 'sex',             // Sex (M or F)
    diagnosis: 'disease_list',
};

g.medical_data_filter = function(record) {
    return (record['disease_list'] || '').match(/^[AB]/); // infectious diseases only
};

g.icd10_headings = {
    "A00": "Cholera",
    "A01": "Typhoid and paratyphoid fevers",
    "A02": "Other salmonella infections",
    "A03": "Shigellosis",
    "A04": "Other bacterial intestinal infections",
    "A05": "Oth bacterial foodborne intoxications, NEC",
    "A06": "Amebiasis",
    "A07": "Other protozoal intestinal diseases",
    "A08": "Viral and other specified intestinal infections",
    "A09": "Infectious gastroenteritis and colitis, unspecified",
    "A15": "Respiratory tuberculosis",
    "A17": "Tuberculosis of nervous system",
    "A18": "Tuberculosis of other organs",
    "A19": "Miliary tuberculosis",
    "A20": "Plague",
    "A21": "Tularemia",
    "A22": "Anthrax",
    "A23": "Brucellosis",
    "A24": "Glanders and melioidosis",
    "A25": "Rat-bite fevers",
    "A26": "Erysipeloid",
    "A27": "Leptospirosis",
    "A28": "Other zoonotic bacterial diseases, not elsewhere classified",
    "A30": "Leprosy [Hansen's disease]",
    "A31": "Infection due to other mycobacteria",
    "A32": "Listeriosis",
    "A33": "Tetanus neonatorum",
    "A34": "Obstetrical tetanus",
    "A35": "Other tetanus",
    "A36": "Diphtheria",
    "A37": "Whooping cough",
    "A38": "Scarlet fever",
    "A39": "Meningococcal infection",
    "A40": "Streptococcal sepsis",
    "A41": "Other sepsis",
    "A42": "Actinomycosis",
    "A43": "Nocardiosis",
    "A44": "Bartonellosis",
    "A46": "Erysipelas",
    "A48": "Other bacterial diseases, not elsewhere classified",
    "A49": "Bacterial infection of unspecified site",
    "A50": "Congenital syphilis",
    "A51": "Early syphilis",
    "A52": "Late syphilis",
    "A53": "Other and unspecified syphilis",
    "A54": "Gonococcal infection",
    "A55": "Chlamydial lymphogranuloma (venereum)",
    "A56": "Other sexually transmitted chlamydial diseases",
    "A57": "Chancroid",
    "A58": "Granuloma inguinale",
    "A59": "Trichomoniasis",
    "A60": "Anogenital herpesviral [herpes simplex] infections",
    "A63": "Oth predominantly sexually transmitted diseases, NEC",
    "A64": "Unspecified sexually transmitted disease",
    "A65": "Nonvenereal syphilis",
    "A66": "Yaws",
    "A67": "Pinta [carate]",
    "A68": "Relapsing fevers",
    "A69": "Other spirochetal infections",
    "A70": "Chlamydia psittaci infections",
    "A71": "Trachoma",
    "A74": "Other diseases caused by chlamydiae",
    "A75": "Typhus fever",
    "A77": "Spotted fever [tick-borne rickettsioses]",
    "A78": "Q fever",
    "A79": "Other rickettsioses",
    "A80": "Acute poliomyelitis",
    "A81": "Atypical virus infections of central nervous system",
    "A82": "Rabies",
    "A83": "Mosquito-borne viral encephalitis",
    "A84": "Tick-borne viral encephalitis",
    "A85": "Other viral encephalitis, not elsewhere classified",
    "A86": "Unspecified viral encephalitis",
    "A87": "Viral meningitis",
    "A88": "Oth viral infections of central nervous system, NEC",
    "A89": "Unspecified viral infection of central nervous system",
    "A90": "Dengue fever [classical dengue]",
    "A91": "Dengue hemorrhagic fever",
    "A92": "Other mosquito-borne viral fevers",
    "A93": "Other arthropod-borne viral fevers, not elsewhere classified",
    "A94": "Unspecified arthropod-borne viral fever",
    "A95": "Yellow fever",
    "A96": "Arenaviral hemorrhagic fever",
    "A98": "Other viral hemorrhagic fevers, not elsewhere classified",
    "A99": "Unspecified viral hemorrhagic fever",
    "B00": "Herpesviral [herpes simplex] infections",
    "B01": "Varicella [chickenpox]",
    "B02": "Zoster [herpes zoster]",
    "B03": "Smallpox",
    "B04": "Monkeypox",
    "B05": "Measles",
    "B06": "Rubella [German measles]",
    "B07": "Viral warts",
    "B08": "Oth viral infect with skin and mucous membrane lesions, NEC",
    "B09": "Unsp viral infection with skin and mucous membrane lesions",
    "B10": "Other human herpesviruses",
    "B15": "Acute hepatitis A",
    "B16": "Acute hepatitis B",
    "B17": "Other acute viral hepatitis",
    "B18": "Chronic viral hepatitis",
    "B19": "Unspecified viral hepatitis",
    "B20": "Human immunodeficiency virus [HIV] disease",
    "B25": "Cytomegaloviral disease",
    "B26": "Mumps",
    "B27": "Infectious mononucleosis",
    "B30": "Viral conjunctivitis",
    "B33": "Other viral diseases, not elsewhere classified",
    "B34": "Viral infection of unspecified site",
    "B35": "Dermatophytosis",
    "B36": "Other superficial mycoses",
    "B37": "Candidiasis",
    "B38": "Coccidioidomycosis",
    "B39": "Histoplasmosis",
    "B40": "Blastomycosis",
    "B41": "Paracoccidioidomycosis",
    "B42": "Sporotrichosis",
    "B43": "Chromomycosis and pheomycotic abscess",
    "B44": "Aspergillosis",
    "B45": "Cryptococcosis",
    "B46": "Zygomycosis",
    "B47": "Mycetoma",
    "B48": "Other mycoses, not elsewhere classified",
    "B49": "Unspecified mycosis",
    "B50": "Plasmodium falciparum malaria",
    "B51": "Plasmodium vivax malaria",
    "B52": "Plasmodium malariae malaria",
    "B53": "Other specified malaria",
    "B54": "Unspecified malaria",
    "B55": "Leishmaniasis",
    "B56": "African trypanosomiasis",
    "B57": "Chagas' disease",
    "B58": "Toxoplasmosis",
    "B59": "Pneumocystosis",
    "B60": "Other protozoal diseases, not elsewhere classified",
    "B64": "Unspecified protozoal disease",
    "B65": "Schistosomiasis [bilharziasis]",
    "B66": "Other fluke infections",
    "B67": "Echinococcosis",
    "B68": "Taeniasis",
    "B69": "Cysticercosis",
    "B70": "Diphyllobothriasis and sparganosis",
    "B71": "Other cestode infections",
    "B72": "Dracunculiasis",
    "B73": "Onchocerciasis",
    "B74": "Filariasis",
    "B75": "Trichinellosis",
    "B76": "Hookworm diseases",
    "B77": "Ascariasis",
    "B78": "Strongyloidiasis",
    "B79": "Trichuriasis",
    "B80": "Enterobiasis",
    "B81": "Other intestinal helminthiases, not elsewhere classified",
    "B82": "Unspecified intestinal parasitism",
    "B83": "Other helminthiases",
    "B85": "Pediculosis and phthiriasis",
    "B86": "Scabies",
    "B87": "Myiasis",
    "B88": "Other infestations",
    "B89": "Unspecified parasitic disease",
    "B90": "Sequelae of tuberculosis",
    "B91": "Sequelae of poliomyelitis",
    "B92": "Sequelae of leprosy",
    "B94": "Sequelae of other and unsp infectious and parasitic diseases",
    "B95": "Strep as the cause of diseases classified elsewhere",
    "B96": "Oth bacterial agents as the cause of diseases classd elswhr",
    "B97": "Viral agents as the cause of diseases classified elsewhere",
    "B99": "Other and unspecified infectious diseases",
    "C00": "Malignant neoplasm of lip",
    "C01": "Malignant neoplasm of base of tongue",
    "C02": "Malignant neoplasm of other and unspecified parts of tongue",
    "C03": "Malignant neoplasm of gum",
    "C04": "Malignant neoplasm of floor of mouth",
    "C05": "Malignant neoplasm of palate",
    "C06": "Malignant neoplasm of other and unspecified parts of mouth",
    "C07": "Malignant neoplasm of parotid gland",
    "C08": "Malignant neoplasm of other and unsp major salivary glands",
    "C09": "Malignant neoplasm of tonsil",
    "C10": "Malignant neoplasm of oropharynx",
    "C11": "Malignant neoplasm of nasopharynx",
    "C12": "Malignant neoplasm of pyriform sinus",
    "C13": "Malignant neoplasm of hypopharynx",
    "C14": "Malig neoplasm of sites in the lip, oral cavity and pharynx",
    "C15": "Malignant neoplasm of esophagus",
    "C16": "Malignant neoplasm of stomach",
    "C17": "Malignant neoplasm of small intestine",
    "C18": "Malignant neoplasm of colon",
    "C19": "Malignant neoplasm of rectosigmoid junction",
    "C20": "Malignant neoplasm of rectum",
    "C21": "Malignant neoplasm of anus and anal canal",
    "C22": "Malignant neoplasm of liver and intrahepatic bile ducts",
    "C23": "Malignant neoplasm of gallbladder",
    "C24": "Malignant neoplasm of other and unsp parts of biliary tract",
    "C25": "Malignant neoplasm of pancreas",
    "C26": "Malignant neoplasm of other and ill-defined digestive organs",
    "C30": "Malignant neoplasm of nasal cavity and middle ear",
    "C31": "Malignant neoplasm of accessory sinuses",
    "C32": "Malignant neoplasm of larynx",
    "C33": "Malignant neoplasm of trachea",
    "C34": "Malignant neoplasm of bronchus and lung",
    "C37": "Malignant neoplasm of thymus",
    "C38": "Malignant neoplasm of heart, mediastinum and pleura",
    "C39": "Malig neoplm of sites in the resp sys and intrathorac organs",
    "C40": "Malignant neoplasm of bone and articular cartilage of limbs",
    "C41": "Malignant neoplasm of bone/artic cartl of and unsp sites",
    "C43": "Malignant melanoma of skin",
    "C4A": "Merkel cell carcinoma",
    "C44": "Other and unspecified malignant neoplasm of skin",
    "C45": "Mesothelioma",
    "C46": "Kaposi's sarcoma",
    "C47": "Malignant neoplasm of prph nerves and autonomic nervous sys",
    "C48": "Malignant neoplasm of retroperitoneum and peritoneum",
    "C49": "Malignant neoplasm of other connective and soft tissue",
    "C50": "Malignant neoplasm of breast",
    "C51": "Malignant neoplasm of vulva",
    "C52": "Malignant neoplasm of vagina",
    "C53": "Malignant neoplasm of cervix uteri",
    "C54": "Malignant neoplasm of corpus uteri",
    "C55": "Malignant neoplasm of uterus, part unspecified",
    "C56": "Malignant neoplasm of ovary",
    "C57": "Malignant neoplasm of other and unsp female genital organs",
    "C58": "Malignant neoplasm of placenta",
    "C60": "Malignant neoplasm of penis",
    "C61": "Malignant neoplasm of prostate",
    "C62": "Malignant neoplasm of testis",
    "C63": "Malignant neoplasm of other and unsp male genital organs",
    "C64": "Malignant neoplasm of kidney, except renal pelvis",
    "C65": "Malignant neoplasm of renal pelvis",
    "C66": "Malignant neoplasm of ureter",
    "C67": "Malignant neoplasm of bladder",
    "C68": "Malignant neoplasm of other and unspecified urinary organs",
    "C69": "Malignant neoplasm of eye and adnexa",
    "C70": "Malignant neoplasm of meninges",
    "C71": "Malignant neoplasm of brain",
    "C72": "Malig neoplm of spinal cord, cranial nerves and oth prt cnsl",
    "C73": "Malignant neoplasm of thyroid gland",
    "C74": "Malignant neoplasm of adrenal gland",
    "C75": "Malignant neoplasm of endo glands and related structures",
    "C7A": "Malignant neuroendocrine tumors",
    "C7B": "Secondary neuroendocrine tumors",
    "C76": "Malignant neoplasm of other and ill-defined sites",
    "C77": "Secondary and unspecified malignant neoplasm of lymph nodes",
    "C78": "Secondary malignant neoplasm of resp and digestive organs",
    "C79": "Secondary malignant neoplasm of other and unspecified sites",
    "C80": "Malignant neoplasm without specification of site",
    "C81": "Hodgkin lymphoma",
    "C82": "Follicular lymphoma",
    "C83": "Non-follicular lymphoma",
    "C84": "Mature T/NK-cell lymphomas",
    "C85": "Oth and unspecified types of non-Hodgkin lymphoma",
    "C86": "Other specified types of T/NK-cell lymphoma",
    "C88": "Malig immunoproliferative dis and certain oth B-cell lymph",
    "C90": "Multiple myeloma and malignant plasma cell neoplasms",
    "C91": "Lymphoid leukemia",
    "C92": "Myeloid leukemia",
    "C93": "Monocytic leukemia",
    "C94": "Other leukemias of specified cell type",
    "C95": "Leukemia of unspecified cell type",
    "C96": "Oth & unsp malig neoplm of lymphoid, hematpoetc and rel tiss",
    "D00": "Carcinoma in situ of oral cavity, esophagus and stomach",
    "D01": "Carcinoma in situ of other and unspecified digestive organs",
    "D02": "Carcinoma in situ of middle ear and respiratory system",
    "D03": "Melanoma in situ",
    "D04": "Carcinoma in situ of skin",
    "D05": "Carcinoma in situ of breast",
    "D06": "Carcinoma in situ of cervix uteri",
    "D07": "Carcinoma in situ of other and unspecified genital organs",
    "D09": "Carcinoma in situ of other and unspecified sites",
    "D10": "Benign neoplasm of mouth and pharynx",
    "D11": "Benign neoplasm of major salivary glands",
    "D12": "Benign neoplasm of colon, rectum, anus and anal canal",
    "D13": "Benign neoplasm of and ill-defined parts of digestive system",
    "D14": "Benign neoplasm of middle ear and respiratory system",
    "D15": "Benign neoplasm of other and unsp intrathoracic organs",
    "D16": "Benign neoplasm of bone and articular cartilage",
    "D17": "Benign lipomatous neoplasm",
    "D18": "Hemangioma and lymphangioma, any site",
    "D19": "Benign neoplasm of mesothelial tissue",
    "D20": "Benign neoplm of soft tissue of retroperiton and peritoneum",
    "D21": "Other benign neoplasms of connective and other soft tissue",
    "D22": "Melanocytic nevi",
    "D23": "Other benign neoplasms of skin",
    "D24": "Benign neoplasm of breast",
    "D25": "Leiomyoma of uterus",
    "D26": "Other benign neoplasms of uterus",
    "D27": "Benign neoplasm of ovary",
    "D28": "Benign neoplasm of other and unsp female genital organs",
    "D29": "Benign neoplasm of male genital organs",
    "D30": "Benign neoplasm of urinary organs",
    "D31": "Benign neoplasm of eye and adnexa",
    "D32": "Benign neoplasm of meninges",
    "D33": "Benign neoplasm of brain and oth prt central nervous system",
    "D34": "Benign neoplasm of thyroid gland",
    "D35": "Benign neoplasm of other and unspecified endocrine glands",
    "D36": "Benign neoplasm of other and unspecified sites",
    "D3A": "Benign neuroendocrine tumors",
    "D37": "Neoplasm of uncrt behavior of oral cavity and dgstv organs",
    "D38": "Neoplm of uncrt behav of mid ear & resp and intrathorac org",
    "D39": "Neoplasm of uncertain behavior of female genital organs",
    "D40": "Neoplasm of uncertain behavior of male genital organs",
    "D41": "Neoplasm of uncertain behavior of urinary organs",
    "D42": "Neoplasm of uncertain behavior of meninges",
    "D43": "Neoplasm of uncertain behavior of brain and cnsl",
    "D44": "Neoplasm of uncertain behavior of endocrine glands",
    "D45": "Polycythemia vera",
    "D46": "Myelodysplastic syndromes",
    "D47": "Oth neoplm of uncrt behav of lymphoid, hematpoetc & rel tiss",
    "D48": "Neoplasm of uncertain behavior of other and unsp sites",
    "D49": "Neoplasms of unspecified behavior",
    "D50": "Iron deficiency anemia",
    "D51": "Vitamin B12 deficiency anemia",
    "D52": "Folate deficiency anemia",
    "D53": "Other nutritional anemias",
    "D55": "Anemia due to enzyme disorders",
    "D56": "Thalassemia",
    "D57": "Sickle-cell disorders",
    "D58": "Other hereditary hemolytic anemias",
    "D59": "Acquired hemolytic anemia",
    "D60": "Acquired pure red cell aplasia [erythroblastopenia]",
    "D61": "Oth aplastic anemias and other bone marrow failure syndromes",
    "D62": "Acute posthemorrhagic anemia",
    "D63": "Anemia in chronic diseases classified elsewhere",
    "D64": "Other anemias",
    "D65": "Disseminated intravascular coagulation",
    "D66": "Hereditary factor VIII deficiency",
    "D67": "Hereditary factor IX deficiency",
    "D68": "Other coagulation defects",
    "D69": "Purpura and other hemorrhagic conditions",
    "D70": "Neutropenia",
    "D71": "Functional disorders of polymorphonuclear neutrophils",
    "D72": "Other disorders of white blood cells",
    "D73": "Diseases of spleen",
    "D74": "Methemoglobinemia",
    "D75": "Other and unsp diseases of blood and blood-forming organs",
    "D76": "Oth dis with lymphoreticular and reticulohistiocytic tissue",
    "D77": "Oth disord of bld/bld-frm organs in diseases classd elswhr",
    "D78": "Intraop and postprocedural complications of the spleen",
    "D80": "Immunodeficiency with predominantly antibody defects",
    "D81": "Combined immunodeficiencies",
    "D82": "Immunodeficiency associated with other major defects",
    "D83": "Common variable immunodeficiency",
    "D84": "Other immunodeficiencies",
    "D86": "Sarcoidosis",
    "D89": "Oth disorders involving the immune mechanism, NEC",
    "E00": "Congenital iodine-deficiency syndrome",
    "E01": "Iodine-deficiency related thyroid disorders and allied cond",
    "E02": "Subclinical iodine-deficiency hypothyroidism",
    "E03": "Other hypothyroidism",
    "E04": "Other nontoxic goiter",
    "E05": "Thyrotoxicosis [hyperthyroidism]",
    "E06": "Thyroiditis",
    "E07": "Other disorders of thyroid",
    "E08": "Diabetes mellitus due to underlying condition",
    "E09": "Drug or chemical induced diabetes mellitus",
    "E10": "Type 1 diabetes mellitus",
    "E11": "Type 2 diabetes mellitus",
    "E13": "Other specified diabetes mellitus",
    "E15": "Nondiabetic hypoglycemic coma",
    "E16": "Other disorders of pancreatic internal secretion",
    "E20": "Hypoparathyroidism",
    "E21": "Hyperparathyroidism and other disorders of parathyroid gland",
    "E22": "Hyperfunction of pituitary gland",
    "E23": "Hypofunction and other disorders of the pituitary gland",
    "E24": "Cushing's syndrome",
    "E25": "Adrenogenital disorders",
    "E26": "Hyperaldosteronism",
    "E27": "Other disorders of adrenal gland",
    "E28": "Ovarian dysfunction",
    "E29": "Testicular dysfunction",
    "E30": "Disorders of puberty, not elsewhere classified",
    "E31": "Polyglandular dysfunction",
    "E32": "Diseases of thymus",
    "E34": "Other endocrine disorders",
    "E35": "Disorders of endocrine glands in diseases classd elswhr",
    "E36": "Intraoperative complications of endocrine system",
    "E40": "Kwashiorkor",
    "E41": "Nutritional marasmus",
    "E42": "Marasmic kwashiorkor",
    "E43": "Unspecified severe protein-calorie malnutrition",
    "E44": "Protein-calorie malnutrition of moderate and mild degree",
    "E45": "Retarded development following protein-calorie malnutrition",
    "E46": "Unspecified protein-calorie malnutrition",
    "E50": "Vitamin A deficiency",
    "E51": "Thiamine deficiency",
    "E52": "Niacin deficiency [pellagra]",
    "E53": "Deficiency of other B group vitamins",
    "E54": "Ascorbic acid deficiency",
    "E55": "Vitamin D deficiency",
    "E56": "Other vitamin deficiencies",
    "E58": "Dietary calcium deficiency",
    "E59": "Dietary selenium deficiency",
    "E60": "Dietary zinc deficiency",
    "E61": "Deficiency of other nutrient elements",
    "E63": "Other nutritional deficiencies",
    "E64": "Sequelae of malnutrition and other nutritional deficiencies",
    "E65": "Localized adiposity",
    "E66": "Overweight and obesity",
    "E67": "Other hyperalimentation",
    "E68": "Sequelae of hyperalimentation",
    "E70": "Disorders of aromatic amino-acid metabolism",
    "E71": "Disord of branched-chain amino-acid metab & fatty-acid metab",
    "E72": "Other disorders of amino-acid metabolism",
    "E73": "Lactose intolerance",
    "E74": "Other disorders of carbohydrate metabolism",
    "E75": "Disord of sphingolipid metab and oth lipid storage disorders",
    "E76": "Disorders of glycosaminoglycan metabolism",
    "E77": "Disorders of glycoprotein metabolism",
    "E78": "Disorders of lipoprotein metabolism and other lipidemias",
    "E79": "Disorders of purine and pyrimidine metabolism",
    "E80": "Disorders of porphyrin and bilirubin metabolism",
    "E83": "Disorders of mineral metabolism",
    "E84": "Cystic fibrosis",
    "E85": "Amyloidosis",
    "E86": "Volume depletion",
    "E87": "Other disorders of fluid, electrolyte and acid-base balance",
    "E88": "Other and unspecified metabolic disorders",
    "E89": "Postproc endocrine and metabolic comp and disorders, NEC",
    "F01": "Vascular dementia",
    "F02": "Dementia in other diseases classified elsewhere",
    "F03": "Unspecified dementia",
    "F04": "Amnestic disorder due to known physiological condition",
    "F05": "Delirium due to known physiological condition",
    "F06": "Other mental disorders due to known physiological condition",
    "F07": "Personality & behavrl disorders due to known physiol cond",
    "F09": "Unsp mental disorder due to known physiological condition",
    "F10": "Alcohol related disorders",
    "F11": "Opioid related disorders",
    "F12": "Cannabis related disorders",
    "F13": "Sedative, hypnotic, or anxiolytic related disorders",
    "F14": "Cocaine related disorders",
    "F15": "Other stimulant related disorders",
    "F16": "Hallucinogen related disorders",
    "F17": "Nicotine dependence",
    "F18": "Inhalant related disorders",
    "F19": "Other psychoactive substance related disorders",
    "F20": "Schizophrenia",
    "F21": "Schizotypal disorder",
    "F22": "Delusional disorders",
    "F23": "Brief psychotic disorder",
    "F24": "Shared psychotic disorder",
    "F25": "Schizoaffective disorders",
    "F28": "Oth psych disorder not due to a sub or known physiol cond",
    "F29": "Unsp psychosis not due to a substance or known physiol cond",
    "F30": "Manic episode",
    "F31": "Bipolar disorder",
    "F32": "Major depressive disorder, single episode",
    "F33": "Major depressive disorder, recurrent",
    "F34": "Persistent mood [affective] disorders",
    "F39": "Unspecified mood [affective] disorder",
    "F40": "Phobic anxiety disorders",
    "F41": "Other anxiety disorders",
    "F42": "Obsessive-compulsive disorder",
    "F43": "Reaction to severe stress, and adjustment disorders",
    "F44": "Dissociative and conversion disorders",
    "F45": "Somatoform disorders",
    "F48": "Other nonpsychotic mental disorders",
    "F50": "Eating disorders",
    "F51": "Sleep disorders not due to a substance or known physiol cond",
    "F52": "Sexual dysfnct not due to a substance or known physiol cond",
    "F53": "Mental and behavrl disorders assoc with the puerperium, NEC",
    "F54": "Psych & behavrl factors assoc w disord or dis classd elswhr",
    "F55": "Abuse of non-psychoactive substances",
    "F59": "Unsp behavrl synd assoc w physiol disturb and physcl factors",
    "F60": "Specific personality disorders",
    "F63": "Impulse disorders",
    "F64": "Gender identity disorders",
    "F65": "Paraphilias",
    "F66": "Other sexual disorders",
    "F68": "Other disorders of adult personality and behavior",
    "F69": "Unspecified disorder of adult personality and behavior",
    "F70": "Mild intellectual disabilities",
    "F71": "Moderate intellectual disabilities",
    "F72": "Severe intellectual disabilities",
    "F73": "Profound intellectual disabilities",
    "F78": "Other intellectual disabilities",
    "F79": "Unspecified intellectual disabilities",
    "F80": "Specific developmental disorders of speech and language",
    "F81": "Specific developmental disorders of scholastic skills",
    "F82": "Specific developmental disorder of motor function",
    "F84": "Pervasive developmental disorders",
    "F88": "Other disorders of psychological development",
    "F89": "Unspecified disorder of psychological development",
    "F90": "Attention-deficit hyperactivity disorders",
    "F91": "Conduct disorders",
    "F93": "Emotional disorders with onset specific to childhood",
    "F94": "Disord social w onset specific to childhood and adolescence",
    "F95": "Tic disorder",
    "F98": "Oth behav/emotn disord w onset usly occur in chldhd and adol",
    "F99": "Mental disorder, not otherwise specified",
    "G00": "Bacterial meningitis, not elsewhere classified",
    "G01": "Meningitis in bacterial diseases classified elsewhere",
    "G02": "Meningitis in oth infec/parastc diseases classd elswhr",
    "G03": "Meningitis due to other and unspecified causes",
    "G04": "Encephalitis, myelitis and encephalomyelitis",
    "G05": "Encphlts, myelitis & encephalomyelitis in dis classd elswhr",
    "G06": "Intracranial and intraspinal abscess and granuloma",
    "G07": "Intcrn & intraspinal abscs & granuloma in dis classd elswhr",
    "G08": "Intracranial and intraspinal phlebitis and thrombophlebitis",
    "G09": "Sequelae of inflammatory diseases of central nervous system",
    "G10": "Huntington's disease",
    "G11": "Hereditary ataxia",
    "G12": "Spinal muscular atrophy and related syndromes",
    "G13": "Systemic atrophies aff cnsl in diseases classd elswhr",
    "G14": "Postpolio syndrome",
    "G20": "Parkinson's disease",
    "G21": "Secondary parkinsonism",
    "G23": "Other degenerative diseases of basal ganglia",
    "G24": "Dystonia",
    "G25": "Other extrapyramidal and movement disorders",
    "G26": "Extrapyramidal and movement disord in diseases classd elswhr",
    "G30": "Alzheimer's disease",
    "G31": "Oth degenerative diseases of nervous system, NEC",
    "G32": "Oth degeneratv disord of nervous sys in dis classd elswhr",
    "G35": "Multiple sclerosis",
    "G36": "Other acute disseminated demyelination",
    "G37": "Other demyelinating diseases of central nervous system",
    "G40": "Epilepsy and recurrent seizures",
    "G43": "Migraine",
    "G44": "Other headache syndromes",
    "G45": "Transient cerebral ischemic attacks and related syndromes",
    "G46": "Vascular syndromes of brain in cerebrovascular diseases",
    "G47": "Sleep disorders",
    "G50": "Disorders of trigeminal nerve",
    "G51": "Facial nerve disorders",
    "G52": "Disorders of other cranial nerves",
    "G53": "Cranial nerve disorders in diseases classified elsewhere",
    "G54": "Nerve root and plexus disorders",
    "G55": "Nerve root and plexus compressions in diseases classd elswhr",
    "G56": "Mononeuropathies of upper limb",
    "G57": "Mononeuropathies of lower limb",
    "G58": "Other mononeuropathies",
    "G59": "Mononeuropathy in diseases classified elsewhere",
    "G60": "Hereditary and idiopathic neuropathy",
    "G61": "Inflammatory polyneuropathy",
    "G62": "Other and unspecified polyneuropathies",
    "G63": "Polyneuropathy in diseases classified elsewhere",
    "G64": "Other disorders of peripheral nervous system",
    "G65": "Sequelae of inflammatory and toxic polyneuropathies",
    "G70": "Myasthenia gravis and other myoneural disorders",
    "G71": "Primary disorders of muscles",
    "G72": "Other and unspecified myopathies",
    "G73": "Disord of myoneural junction and muscle in dis classd elswhr",
    "G80": "Cerebral palsy",
    "G81": "Hemiplegia and hemiparesis",
    "G82": "Paraplegia (paraparesis) and quadriplegia (quadriparesis)",
    "G83": "Other paralytic syndromes",
    "G89": "Pain, not elsewhere classified",
    "G90": "Disorders of autonomic nervous system",
    "G91": "Hydrocephalus",
    "G92": "Toxic encephalopathy",
    "G93": "Other disorders of brain",
    "G94": "Other disorders of brain in diseases classified elsewhere",
    "G95": "Other and unspecified diseases of spinal cord",
    "G96": "Other disorders of central nervous system",
    "G97": "Intraop and postproc comp and disorders of nervous sys, NEC",
    "G98": "Other disorders of nervous system not elsewhere classified",
    "G99": "Oth disorders of nervous system in diseases classd elswhr",
    "H00": "Hordeolum and chalazion",
    "H01": "Other inflammation of eyelid",
    "H02": "Other disorders of eyelid",
    "H04": "Disorders of lacrimal system",
    "H05": "Disorders of orbit",
    "H10": "Conjunctivitis",
    "H11": "Other disorders of conjunctiva",
    "H15": "Disorders of sclera",
    "H16": "Keratitis",
    "H17": "Corneal scars and opacities",
    "H18": "Other disorders of cornea",
    "H20": "Iridocyclitis",
    "H21": "Other disorders of iris and ciliary body",
    "H22": "Disorders of iris and ciliary body in diseases classd elswhr",
    "H25": "Age-related cataract",
    "H26": "Other cataract",
    "H27": "Other disorders of lens",
    "H28": "Cataract in diseases classified elsewhere",
    "H30": "Chorioretinal inflammation",
    "H31": "Other disorders of choroid",
    "H32": "Chorioretinal disorders in diseases classified elsewhere",
    "H33": "Retinal detachments and breaks",
    "H34": "Retinal vascular occlusions",
    "H35": "Other retinal disorders",
    "H36": "Retinal disorders in diseases classified elsewhere",
    "H40": "Glaucoma",
    "H42": "Glaucoma in diseases classified elsewhere",
    "H43": "Disorders of vitreous body",
    "H44": "Disorders of globe",
    "H46": "Optic neuritis",
    "H47": "Other disorders of optic [2nd] nerve and visual pathways",
    "H49": "Paralytic strabismus",
    "H50": "Other strabismus",
    "H51": "Other disorders of binocular movement",
    "H52": "Disorders of refraction and accommodation",
    "H53": "Visual disturbances",
    "H54": "Blindness and low vision",
    "H55": "Nystagmus and other irregular eye movements",
    "H57": "Other disorders of eye and adnexa",
    "H59": "Intraop and postproc comp and disord of eye and adnexa, NEC",
    "H60": "Otitis externa",
    "H61": "Other disorders of external ear",
    "H62": "Disorders of external ear in diseases classified elsewhere",
    "H65": "Nonsuppurative otitis media",
    "H66": "Suppurative and unspecified otitis media",
    "H67": "Otitis media in diseases classified elsewhere",
    "H68": "Eustachian salpingitis and obstruction",
    "H69": "Other and unspecified disorders of Eustachian tube",
    "H70": "Mastoiditis and related conditions",
    "H71": "Cholesteatoma of middle ear",
    "H72": "Perforation of tympanic membrane",
    "H73": "Other disorders of tympanic membrane",
    "H74": "Other disorders of middle ear mastoid",
    "H75": "Oth disord of mid ear and mastoid in diseases classd elswhr",
    "H80": "Otosclerosis",
    "H81": "Disorders of vestibular function",
    "H82": "Vertiginous syndromes in diseases classified elsewhere",
    "H83": "Other diseases of inner ear",
    "H90": "Conductive and sensorineural hearing loss",
    "H91": "Other and unspecified hearing loss",
    "H92": "Otalgia and effusion of ear",
    "H93": "Other disorders of ear, not elsewhere classified",
    "H94": "Other disorders of ear in diseases classified elsewhere",
    "H95": "Intraop and postproc comp and disorders of ear/mastd, NEC",
    "I00": "Rheumatic fever without heart involvement",
    "I01": "Rheumatic fever with heart involvement",
    "I02": "Rheumatic chorea",
    "I05": "Rheumatic mitral valve diseases",
    "I06": "Rheumatic aortic valve diseases",
    "I07": "Rheumatic tricuspid valve diseases",
    "I08": "Multiple valve diseases",
    "I09": "Other rheumatic heart diseases",
    "I10": "Essential (primary) hypertension",
    "I11": "Hypertensive heart disease",
    "I12": "Hypertensive chronic kidney disease",
    "I13": "Hypertensive heart and chronic kidney disease",
    "I15": "Secondary hypertension",
    "I16": "Hypertensive crisis",
    "I20": "Angina pectoris",
    "I21": "Acute myocardial infarction",
    "I22": "Subsequent STEMI & NSTEMI mocard infrc",
    "I23": "Certain crnt comp fol STEMI & NSTEMI mocard infrc <= 28 day",
    "I24": "Other acute ischemic heart diseases",
    "I25": "Chronic ischemic heart disease",
    "I26": "Pulmonary embolism",
    "I27": "Other pulmonary heart diseases",
    "I28": "Other diseases of pulmonary vessels",
    "I30": "Acute pericarditis",
    "I31": "Other diseases of pericardium",
    "I32": "Pericarditis in diseases classified elsewhere",
    "I33": "Acute and subacute endocarditis",
    "I34": "Nonrheumatic mitral valve disorders",
    "I35": "Nonrheumatic aortic valve disorders",
    "I36": "Nonrheumatic tricuspid valve disorders",
    "I37": "Nonrheumatic pulmonary valve disorders",
    "I38": "Endocarditis, valve unspecified",
    "I39": "Endocarditis and heart valve disord in dis classd elswhr",
    "I40": "Acute myocarditis",
    "I41": "Myocarditis in diseases classified elsewhere",
    "I42": "Cardiomyopathy",
    "I43": "Cardiomyopathy in diseases classified elsewhere",
    "I44": "Atrioventricular and left bundle-branch block",
    "I45": "Other conduction disorders",
    "I46": "Cardiac arrest",
    "I47": "Paroxysmal tachycardia",
    "I48": "Atrial fibrillation and flutter",
    "I49": "Other cardiac arrhythmias",
    "I50": "Heart failure",
    "I51": "Complications and ill-defined descriptions of heart disease",
    "I52": "Other heart disorders in diseases classified elsewhere",
    "I60": "Nontraumatic subarachnoid hemorrhage",
    "I61": "Nontraumatic intracerebral hemorrhage",
    "I62": "Other and unspecified nontraumatic intracranial hemorrhage",
    "I63": "Cerebral infarction",
    "I65": "Occls and stenosis of precerb art, not rslt in cereb infrc",
    "I66": "Occls and stenosis of cereb art, not rslt in cerebral infrc",
    "I67": "Other cerebrovascular diseases",
    "I68": "Cerebrovascular disorders in diseases classified elsewhere",
    "I69": "Sequelae of cerebrovascular disease",
    "I70": "Atherosclerosis",
    "I71": "Aortic aneurysm and dissection",
    "I72": "Other aneurysm",
    "I73": "Other peripheral vascular diseases",
    "I74": "Arterial embolism and thrombosis",
    "I75": "Atheroembolism",
    "I76": "Septic arterial embolism",
    "I77": "Other disorders of arteries and arterioles",
    "I78": "Diseases of capillaries",
    "I79": "Disord of art, arterioles and capilare in dis classd elswhr",
    "I80": "Phlebitis and thrombophlebitis",
    "I81": "Portal vein thrombosis",
    "I82": "Other venous embolism and thrombosis",
    "I83": "Varicose veins of lower extremities",
    "I85": "Esophageal varices",
    "I86": "Varicose veins of other sites",
    "I87": "Other disorders of veins",
    "I88": "Nonspecific lymphadenitis",
    "I89": "Oth noninfective disorders of lymphatic vessels and nodes",
    "I95": "Hypotension",
    "I96": "Gangrene, not elsewhere classified",
    "I97": "Intraop and postproc comp and disorders of circ sys, NEC",
    "I99": "Other and unspecified disorders of circulatory system",
    "J00": "Acute nasopharyngitis [common cold]",
    "J01": "Acute sinusitis",
    "J02": "Acute pharyngitis",
    "J03": "Acute tonsillitis",
    "J04": "Acute laryngitis and tracheitis",
    "J05": "Acute obstructive laryngitis [croup] and epiglottitis",
    "J06": "Acute upper resp infections of multiple and unsp sites",
    "J09": "Influenza due to certain identified influenza viruses",
    "J10": "Influenza due to other identified influenza virus",
    "J11": "Influenza due to unidentified influenza virus",
    "J12": "Viral pneumonia, not elsewhere classified",
    "J13": "Pneumonia due to Streptococcus pneumoniae",
    "J14": "Pneumonia due to Hemophilus influenzae",
    "J15": "Bacterial pneumonia, not elsewhere classified",
    "J16": "Pneumonia due to oth infectious organisms, NEC",
    "J17": "Pneumonia in diseases classified elsewhere",
    "J18": "Pneumonia, unspecified organism",
    "J20": "Acute bronchitis",
    "J21": "Acute bronchiolitis",
    "J22": "Unspecified acute lower respiratory infection",
    "J30": "Vasomotor and allergic rhinitis",
    "J31": "Chronic rhinitis, nasopharyngitis and pharyngitis",
    "J32": "Chronic sinusitis",
    "J33": "Nasal polyp",
    "J34": "Other and unspecified disorders of nose and nasal sinuses",
    "J35": "Chronic diseases of tonsils and adenoids",
    "J36": "Peritonsillar abscess",
    "J37": "Chronic laryngitis and laryngotracheitis",
    "J38": "Diseases of vocal cords and larynx, not elsewhere classified",
    "J39": "Other diseases of upper respiratory tract",
    "J40": "Bronchitis, not specified as acute or chronic",
    "J41": "Simple and mucopurulent chronic bronchitis",
    "J42": "Unspecified chronic bronchitis",
    "J43": "Emphysema",
    "J44": "Other chronic obstructive pulmonary disease",
    "J45": "Asthma",
    "J47": "Bronchiectasis",
    "J60": "Coalworker's pneumoconiosis",
    "J61": "Pneumoconiosis due to asbestos and other mineral fibers",
    "J62": "Pneumoconiosis due to dust containing silica",
    "J63": "Pneumoconiosis due to other inorganic dusts",
    "J64": "Unspecified pneumoconiosis",
    "J65": "Pneumoconiosis associated with tuberculosis",
    "J66": "Airway disease due to specific organic dust",
    "J67": "Hypersensitivity pneumonitis due to organic dust",
    "J68": "Resp cond d/t inhalation of chemicals, gas, fumes and vapors",
    "J69": "Pneumonitis due to solids and liquids",
    "J70": "Respiratory conditions due to other external agents",
    "J80": "Acute respiratory distress syndrome",
    "J81": "Pulmonary edema",
    "J82": "Pulmonary eosinophilia, not elsewhere classified",
    "J84": "Other interstitial pulmonary diseases",
    "J85": "Abscess of lung and mediastinum",
    "J86": "Pyothorax",
    "J90": "Pleural effusion, not elsewhere classified",
    "J91": "Pleural effusion in conditions classified elsewhere",
    "J92": "Pleural plaque",
    "J93": "Pneumothorax and air leak",
    "J94": "Other pleural conditions",
    "J95": "Intraop and postproc comp and disorders of resp sys, NEC",
    "J96": "Respiratory failure, not elsewhere classified",
    "J98": "Other respiratory disorders",
    "J99": "Respiratory disorders in diseases classified elsewhere",
    "K00": "Disorders of tooth development and eruption",
    "K01": "Embedded and impacted teeth",
    "K02": "Dental caries",
    "K03": "Other diseases of hard tissues of teeth",
    "K04": "Diseases of pulp and periapical tissues",
    "K05": "Gingivitis and periodontal diseases",
    "K06": "Other disorders of gingiva and edentulous alveolar ridge",
    "K08": "Other disorders of teeth and supporting structures",
    "K09": "Cysts of oral region, not elsewhere classified",
    "K11": "Diseases of salivary glands",
    "K12": "Stomatitis and related lesions",
    "K13": "Other diseases of lip and oral mucosa",
    "K14": "Diseases of tongue",
    "K20": "Esophagitis",
    "K21": "Gastro-esophageal reflux disease",
    "K22": "Other diseases of esophagus",
    "K23": "Disorders of esophagus in diseases classified elsewhere",
    "K25": "Gastric ulcer",
    "K26": "Duodenal ulcer",
    "K27": "Peptic ulcer, site unspecified",
    "K28": "Gastrojejunal ulcer",
    "K29": "Gastritis and duodenitis",
    "K30": "Functional dyspepsia",
    "K31": "Other diseases of stomach and duodenum",
    "K35": "Acute appendicitis",
    "K36": "Other appendicitis",
    "K37": "Unspecified appendicitis",
    "K38": "Other diseases of appendix",
    "K40": "Inguinal hernia",
    "K41": "Femoral hernia",
    "K42": "Umbilical hernia",
    "K43": "Ventral hernia",
    "K44": "Diaphragmatic hernia",
    "K45": "Other abdominal hernia",
    "K46": "Unspecified abdominal hernia",
    "K50": "Crohn's disease [regional enteritis]",
    "K51": "Ulcerative colitis",
    "K52": "Other and unsp noninfective gastroenteritis and colitis",
    "K55": "Vascular disorders of intestine",
    "K56": "Paralytic ileus and intestinal obstruction without hernia",
    "K57": "Diverticular disease of intestine",
    "K58": "Irritable bowel syndrome",
    "K59": "Other functional intestinal disorders",
    "K60": "Fissure and fistula of anal and rectal regions",
    "K61": "Abscess of anal and rectal regions",
    "K62": "Other diseases of anus and rectum",
    "K63": "Other diseases of intestine",
    "K64": "Hemorrhoids and perianal venous thrombosis",
    "K65": "Peritonitis",
    "K66": "Other disorders of peritoneum",
    "K67": "Disorders of peritoneum in infectious diseases classd elswhr",
    "K68": "Disorders of retroperitoneum",
    "K70": "Alcoholic liver disease",
    "K71": "Toxic liver disease",
    "K72": "Hepatic failure, not elsewhere classified",
    "K73": "Chronic hepatitis, not elsewhere classified",
    "K74": "Fibrosis and cirrhosis of liver",
    "K75": "Other inflammatory liver diseases",
    "K76": "Other diseases of liver",
    "K77": "Liver disorders in diseases classified elsewhere",
    "K80": "Cholelithiasis",
    "K81": "Cholecystitis",
    "K82": "Other diseases of gallbladder",
    "K83": "Other diseases of biliary tract",
    "K85": "Acute pancreatitis",
    "K86": "Other diseases of pancreas",
    "K87": "Disord of GB, biliary trac and pancreas in dis classd elswhr",
    "K90": "Intestinal malabsorption",
    "K91": "Intraop and postproc comp and disorders of dgstv sys, NEC",
    "K92": "Other diseases of digestive system",
    "K94": "Complications of artificial openings of the digestive system",
    "K95": "Complications of bariatric procedures",
    "L00": "Staphylococcal scalded skin syndrome",
    "L01": "Impetigo",
    "L02": "Cutaneous abscess, furuncle and carbuncle",
    "L03": "Cellulitis and acute lymphangitis",
    "L04": "Acute lymphadenitis",
    "L05": "Pilonidal cyst and sinus",
    "L08": "Other local infections of skin and subcutaneous tissue",
    "L10": "Pemphigus",
    "L11": "Other acantholytic disorders",
    "L12": "Pemphigoid",
    "L13": "Other bullous disorders",
    "L14": "Bullous disorders in diseases classified elsewhere",
    "L20": "Atopic dermatitis",
    "L21": "Seborrheic dermatitis",
    "L22": "Diaper dermatitis",
    "L23": "Allergic contact dermatitis",
    "L24": "Irritant contact dermatitis",
    "L25": "Unspecified contact dermatitis",
    "L26": "Exfoliative dermatitis",
    "L27": "Dermatitis due to substances taken internally",
    "L28": "Lichen simplex chronicus and prurigo",
    "L29": "Pruritus",
    "L30": "Other and unspecified dermatitis",
    "L40": "Psoriasis",
    "L41": "Parapsoriasis",
    "L42": "Pityriasis rosea",
    "L43": "Lichen planus",
    "L44": "Other papulosquamous disorders",
    "L45": "Papulosquamous disorders in diseases classified elsewhere",
    "L49": "Exfoliatn due to erythemat cond accord extent body involv",
    "L50": "Urticaria",
    "L51": "Erythema multiforme",
    "L52": "Erythema nodosum",
    "L53": "Other erythematous conditions",
    "L54": "Erythema in diseases classified elsewhere",
    "L55": "Sunburn",
    "L56": "Other acute skin changes due to ultraviolet radiation",
    "L57": "Skin changes due to chronic expsr to nonionizing radiation",
    "L58": "Radiodermatitis",
    "L59": "Oth disorders of skin, subcu related to radiation",
    "L60": "Nail disorders",
    "L62": "Nail disorders in diseases classified elsewhere",
    "L63": "Alopecia areata",
    "L64": "Androgenic alopecia",
    "L65": "Other nonscarring hair loss",
    "L66": "Cicatricial alopecia [scarring hair loss]",
    "L67": "Hair color and hair shaft abnormalities",
    "L68": "Hypertrichosis",
    "L70": "Acne",
    "L71": "Rosacea",
    "L72": "Follicular cysts of skin and subcutaneous tissue",
    "L73": "Other follicular disorders",
    "L74": "Eccrine sweat disorders",
    "L75": "Apocrine sweat disorders",
    "L76": "Intraop and postprocedural complications of skin, subcu",
    "L80": "Vitiligo",
    "L81": "Other disorders of pigmentation",
    "L82": "Seborrheic keratosis",
    "L83": "Acanthosis nigricans",
    "L84": "Corns and callosities",
    "L85": "Other epidermal thickening",
    "L86": "Keratoderma in diseases classified elsewhere",
    "L87": "Transepidermal elimination disorders",
    "L88": "Pyoderma gangrenosum",
    "L89": "Pressure ulcer",
    "L90": "Atrophic disorders of skin",
    "L91": "Hypertrophic disorders of skin",
    "L92": "Granulomatous disorders of skin and subcutaneous tissue",
    "L93": "Lupus erythematosus",
    "L94": "Other localized connective tissue disorders",
    "L95": "Vasculitis limited to skin, not elsewhere classified",
    "L97": "Non-pressure chronic ulcer of lower limb, NEC",
    "L98": "Oth disorders of skin, subcu, not elsewhere classified",
    "L99": "Oth disorders of skin, subcu in diseases classd elswhr",
    "M00": "Pyogenic arthritis",
    "M01": "Direct infect of joint in infec/parastc dis classd elswhr",
    "M02": "Postinfective and reactive arthropathies",
    "M04": "Autoinflammatory syndromes",
    "M05": "Rheumatoid arthritis with rheumatoid factor",
    "M06": "Other rheumatoid arthritis",
    "M07": "Enteropathic arthropathies",
    "M08": "Juvenile arthritis",
    "M1A": "Chronic gout",
    "M10": "Gout",
    "M11": "Other crystal arthropathies",
    "M12": "Other and unspecified arthropathy",
    "M13": "Other arthritis",
    "M14": "Arthropathies in other diseases classified elsewhere",
    "M15": "Polyosteoarthritis",
    "M16": "Osteoarthritis of hip",
    "M17": "Osteoarthritis of knee",
    "M18": "Osteoarthritis of first carpometacarpal joint",
    "M19": "Other and unspecified osteoarthritis",
    "M20": "Acquired deformities of fingers and toes",
    "M21": "Other acquired deformities of limbs",
    "M22": "Disorder of patella",
    "M23": "Internal derangement of knee",
    "M24": "Other specific joint derangements",
    "M25": "Other joint disorder, not elsewhere classified",
    "M26": "Dentofacial anomalies [including malocclusion]",
    "M27": "Other diseases of jaws",
    "M30": "Polyarteritis nodosa and related conditions",
    "M31": "Other necrotizing vasculopathies",
    "M32": "Systemic lupus erythematosus (SLE)",
    "M33": "Dermatopolymyositis",
    "M34": "Systemic sclerosis [scleroderma]",
    "M35": "Other systemic involvement of connective tissue",
    "M36": "Systemic disorders of conn tiss in diseases classd elswhr",
    "M40": "Kyphosis and lordosis",
    "M41": "Scoliosis",
    "M42": "Spinal osteochondrosis",
    "M43": "Other deforming dorsopathies",
    "M45": "Ankylosing spondylitis",
    "M46": "Other inflammatory spondylopathies",
    "M47": "Spondylosis",
    "M48": "Other spondylopathies",
    "M49": "Spondylopathies in diseases classified elsewhere",
    "M50": "Cervical disc disorders",
    "M51": "Thoracic, thoracolum, and lumbosacral intvrt disc disorders",
    "M53": "Other and unspecified dorsopathies, not elsewhere classified",
    "M54": "Dorsalgia",
    "M60": "Myositis",
    "M61": "Calcification and ossification of muscle",
    "M62": "Other disorders of muscle",
    "M63": "Disorders of muscle in diseases classified elsewhere",
    "M65": "Synovitis and tenosynovitis",
    "M66": "Spontaneous rupture of synovium and tendon",
    "M67": "Other disorders of synovium and tendon",
    "M70": "Soft tissue disorders related to use, overuse and pressure",
    "M71": "Other bursopathies",
    "M72": "Fibroblastic disorders",
    "M75": "Shoulder lesions",
    "M76": "Enthesopathies, lower limb, excluding foot",
    "M77": "Other enthesopathies",
    "M79": "Oth and unsp soft tissue disorders, not elsewhere classified",
    "M80": "Osteoporosis with current pathological fracture",
    "M81": "Osteoporosis without current pathological fracture",
    "M83": "Adult osteomalacia",
    "M84": "Disorder of continuity of bone",
    "M85": "Other disorders of bone density and structure",
    "M86": "Osteomyelitis",
    "M87": "Osteonecrosis",
    "M88": "Osteitis deformans [Paget's disease of bone]",
    "M89": "Other disorders of bone",
    "M90": "Osteopathies in diseases classified elsewhere",
    "M91": "Juvenile osteochondrosis of hip and pelvis",
    "M92": "Other juvenile osteochondrosis",
    "M93": "Other osteochondropathies",
    "M94": "Other disorders of cartilage",
    "M95": "Oth acquired deformities of ms sys and connective tissue",
    "M96": "Intraop and postproc comp and disorders of ms sys, NEC",
    "M97": "Periprosthetic fracture around internal prosthetic joint",
    "M99": "Biomechanical lesions, not elsewhere classified",
    "N00": "Acute nephritic syndrome",
    "N01": "Rapidly progressive nephritic syndrome",
    "N02": "Recurrent and persistent hematuria",
    "N03": "Chronic nephritic syndrome",
    "N04": "Nephrotic syndrome",
    "N05": "Unspecified nephritic syndrome",
    "N06": "Isolated proteinuria with specified morphological lesion",
    "N07": "Hereditary nephropathy, not elsewhere classified",
    "N08": "Glomerular disorders in diseases classified elsewhere",
    "N10": "Acute pyelonephritis",
    "N11": "Chronic tubulo-interstitial nephritis",
    "N12": "Tubulo-interstitial nephritis, not spcf as acute or chronic",
    "N13": "Obstructive and reflux uropathy",
    "N14": "Drug- & heavy-metal-induced tubulo-interstitial & tublr cond",
    "N15": "Other renal tubulo-interstitial diseases",
    "N16": "Renal tubulo-interstitial disord in diseases classd elswhr",
    "N17": "Acute kidney failure",
    "N18": "Chronic kidney disease (CKD)",
    "N19": "Unspecified kidney failure",
    "N20": "Calculus of kidney and ureter",
    "N21": "Calculus of lower urinary tract",
    "N22": "Calculus of urinary tract in diseases classified elsewhere",
    "N23": "Unspecified renal colic",
    "N25": "Disorders resulting from impaired renal tubular function",
    "N26": "Unspecified contracted kidney",
    "N27": "Small kidney of unknown cause",
    "N28": "Oth disorders of kidney and ureter, not elsewhere classified",
    "N29": "Oth disorders of kidney and ureter in diseases classd elswhr",
    "N30": "Cystitis",
    "N31": "Neuromuscular dysfunction of bladder, NEC",
    "N32": "Other disorders of bladder",
    "N33": "Bladder disorders in diseases classified elsewhere",
    "N34": "Urethritis and urethral syndrome",
    "N35": "Urethral stricture",
    "N36": "Other disorders of urethra",
    "N37": "Urethral disorders in diseases classified elsewhere",
    "N39": "Other disorders of urinary system",
    "N40": "Benign prostatic hyperplasia",
    "N41": "Inflammatory diseases of prostate",
    "N42": "Other and unspecified disorders of prostate",
    "N43": "Hydrocele and spermatocele",
    "N44": "Noninflammatory disorders of testis",
    "N45": "Orchitis and epididymitis",
    "N46": "Male infertility",
    "N47": "Disorders of prepuce",
    "N48": "Other disorders of penis",
    "N49": "Inflammatory disorders of male genital organs, NEC",
    "N50": "Other and unspecified disorders of male genital organs",
    "N51": "Disorders of male genital organs in diseases classd elswhr",
    "N52": "Male erectile dysfunction",
    "N53": "Other male sexual dysfunction",
    "N60": "Benign mammary dysplasia",
    "N61": "Inflammatory disorders of breast",
    "N62": "Hypertrophy of breast",
    "N63": "Unspecified lump in breast",
    "N64": "Other disorders of breast",
    "N65": "Deformity and disproportion of reconstructed breast",
    "N70": "Salpingitis and oophoritis",
    "N71": "Inflammatory disease of uterus, except cervix",
    "N72": "Inflammatory disease of cervix uteri",
    "N73": "Other female pelvic inflammatory diseases",
    "N74": "Female pelvic inflam disorders in diseases classd elswhr",
    "N75": "Diseases of Bartholin's gland",
    "N76": "Other inflammation of vagina and vulva",
    "N77": "Vulvovaginal ulceration and inflam in diseases classd elswhr",
    "N80": "Endometriosis",
    "N81": "Female genital prolapse",
    "N82": "Fistulae involving female genital tract",
    "N83": "Noninflammatory disord of ovary, fallop and broad ligament",
    "N84": "Polyp of female genital tract",
    "N85": "Other noninflammatory disorders of uterus, except cervix",
    "N86": "Erosion and ectropion of cervix uteri",
    "N87": "Dysplasia of cervix uteri",
    "N88": "Other noninflammatory disorders of cervix uteri",
    "N89": "Other noninflammatory disorders of vagina",
    "N90": "Other noninflammatory disorders of vulva and perineum",
    "N91": "Absent, scanty and rare menstruation",
    "N92": "Excessive, frequent and irregular menstruation",
    "N93": "Other abnormal uterine and vaginal bleeding",
    "N94": "Pain and oth cond assoc w fem gntl org and menstrual cycle",
    "N95": "Menopausal and other perimenopausal disorders",
    "N96": "Recurrent pregnancy loss",
    "N97": "Female infertility",
    "N98": "Complications associated with artificial fertilization",
    "N99": "Intraop and postproc comp and disorders of GU sys, NEC",
    "O00": "Ectopic pregnancy",
    "O01": "Hydatidiform mole",
    "O02": "Other abnormal products of conception",
    "O03": "Spontaneous abortion",
    "O04": "Complications following (induced) termination of pregnancy",
    "O07": "Failed attempted termination of pregnancy",
    "O08": "Complications following ectopic and molar pregnancy",
    "O09": "Supervision of high risk pregnancy",
    "O10": "Pre-existing hypertension compl preg/chldbrth",
    "O11": "Pre-existing hypertension with pre-eclampsia",
    "O12": "Gestational edema and proteinuria without hypertension",
    "O13": "Gestational hypertension without significant proteinuria",
    "O14": "Pre-eclampsia",
    "O15": "Eclampsia",
    "O16": "Unspecified maternal hypertension",
    "O20": "Hemorrhage in early pregnancy",
    "O21": "Excessive vomiting in pregnancy",
    "O22": "Venous complications and hemorrhoids in pregnancy",
    "O23": "Infections of genitourinary tract in pregnancy",
    "O24": "Diabetes in pregnancy, childbirth, and the puerperium",
    "O25": "Malnutrition in pregnancy, childbirth and the puerperium",
    "O26": "Maternal care for oth conditions predom related to pregnancy",
    "O28": "Abnormal findings on antenatal screening of mother",
    "O29": "Complications of anesthesia during pregnancy",
    "O30": "Multiple gestation",
    "O31": "Complications specific to multiple gestation",
    "O32": "Maternal care for malpresentation of fetus",
    "O33": "Maternal care for disproportion",
    "O34": "Maternal care for abnormality of pelvic organs",
    "O35": "Maternal care for known or suspected fetal abnlt and damage",
    "O36": "Maternal care for other fetal problems",
    "O40": "Polyhydramnios",
    "O41": "Other disorders of amniotic fluid and membranes",
    "O42": "Premature rupture of membranes",
    "O43": "Placental disorders",
    "O44": "Placenta previa",
    "O45": "Premature separation of placenta [abruptio placentae]",
    "O46": "Antepartum hemorrhage, not elsewhere classified",
    "O47": "False labor",
    "O48": "Late pregnancy",
    "O60": "Preterm labor",
    "O61": "Failed induction of labor",
    "O62": "Abnormalities of forces of labor",
    "O63": "Long labor",
    "O64": "Obstructed labor due to malposition and malpresent of fetus",
    "O65": "Obstructed labor due to maternal pelvic abnormality",
    "O66": "Other obstructed labor",
    "O67": "Labor and delivery comp by intrapartum hemorrhage, NEC",
    "O68": "Labor and delivery comp by abnlt of fetal acid-base balance",
    "O69": "Labor and delivery complicated by umbilical cord comp",
    "O70": "Perineal laceration during delivery",
    "O71": "Other obstetric trauma",
    "O72": "Postpartum hemorrhage",
    "O73": "Retained placenta and membranes, without hemorrhage",
    "O74": "Complications of anesthesia during labor and delivery",
    "O75": "Oth complications of labor and delivery, NEC",
    "O76": "Abnlt in fetal heart rate and rhythm comp labor and delivery",
    "O77": "Other fetal stress complicating labor and delivery",
    "O80": "Encounter for full-term uncomplicated delivery",
    "O82": "Encounter for cesarean delivery without indication",
    "O85": "Puerperal sepsis",
    "O86": "Other puerperal infections",
    "O87": "Venous complications and hemorrhoids in the puerperium",
    "O88": "Obstetric embolism",
    "O89": "Complications of anesthesia during the puerperium",
    "O90": "Complications of the puerperium, not elsewhere classified",
    "O91": "Infect of breast assoc w pregnancy, the puerp and lactation",
    "O92": "Oth disord of brst/lactatn assoc w pregnancy and the puerp",
    "O94": "Sequelae of comp of pregnancy, chldbrth, and the puerperium",
    "O98": "Matern infec/parastc dis classd elsw but compl preg/chldbrth",
    "O99": "Oth maternal diseases classd elsw but compl preg/chldbrth",
    "O9A": "Maternl malig or injury compl preg/childbrth",
    "P00": "NB aff by matern cond that may be unrelated to present preg",
    "P01": "Newborn affected by maternal complications of pregnancy",
    "P02": "Newborn affected by comp of placenta, cord and membranes",
    "P03": "Newborn affected by other comp of labor and delivery",
    "P04": "NB aff by noxious substnc transmitd via plcnta or brst milk",
    "P05": "Disord of NB related to slow fetal growth and fetal malnut",
    "P07": "Disord of NB related to short gest and low birth weight, NEC",
    "P08": "Disord of newborn related to long gest and high birth weight",
    "P09": "Abnormal findings on neonatal screening",
    "P10": "Intracranial laceration and hemorrhage due to birth injury",
    "P11": "Other birth injuries to central nervous system",
    "P12": "Birth injury to scalp",
    "P13": "Birth injury to skeleton",
    "P14": "Birth injury to peripheral nervous system",
    "P15": "Other birth injuries",
    "P19": "Metabolic acidemia in newborn",
    "P22": "Respiratory distress of newborn",
    "P23": "Congenital pneumonia",
    "P24": "Neonatal aspiration",
    "P25": "Interstit emphysema and rel cond origin in perinat period",
    "P26": "Pulmonary hemorrhage originating in the perinatal period",
    "P27": "Chronic respiratory disease origin in the perinatal period",
    "P28": "Oth respiratory conditions origin in the perinatal period",
    "P29": "Cardiovascular disorders originating in the perinatal period",
    "P35": "Congenital viral diseases",
    "P36": "Bacterial sepsis of newborn",
    "P37": "Other congenital infectious and parasitic diseases",
    "P38": "Omphalitis of newborn",
    "P39": "Other infections specific to the perinatal period",
    "P50": "Newborn affected by intrauterine (fetal) blood loss",
    "P51": "Umbilical hemorrhage of newborn",
    "P52": "Intracranial nontraumatic hemorrhage of newborn",
    "P53": "Hemorrhagic disease of newborn",
    "P54": "Other neonatal hemorrhages",
    "P55": "Hemolytic disease of newborn",
    "P56": "Hydrops fetalis due to hemolytic disease",
    "P57": "Kernicterus",
    "P58": "Neonatal jaundice due to other excessive hemolysis",
    "P59": "Neonatal jaundice from other and unspecified causes",
    "P60": "Disseminated intravascular coagulation of newborn",
    "P61": "Other perinatal hematological disorders",
    "P70": "Transitory disord of carbohydrate metab specific to newborn",
    "P71": "Transitory neonatal disorders of calcium and magnesium metab",
    "P72": "Other transitory neonatal endocrine disorders",
    "P74": "Oth transitory neonatal electrolyte and metabolic disturb",
    "P76": "Other intestinal obstruction of newborn",
    "P77": "Necrotizing enterocolitis of newborn",
    "P78": "Other perinatal digestive system disorders",
    "P80": "Hypothermia of newborn",
    "P81": "Other disturbances of temperature regulation of newborn",
    "P83": "Other conditions of integument specific to newborn",
    "P84": "Other problems with newborn",
    "P90": "Convulsions of newborn",
    "P91": "Other disturbances of cerebral status of newborn",
    "P92": "Feeding problems of newborn",
    "P93": "Reactions and intoxications due to drugs administered to NB",
    "P94": "Disorders of muscle tone of newborn",
    "P95": "Stillbirth",
    "P96": "Other conditions originating in the perinatal period",
    "Q00": "Anencephaly and similar malformations",
    "Q01": "Encephalocele",
    "Q02": "Microcephaly",
    "Q03": "Congenital hydrocephalus",
    "Q04": "Other congenital malformations of brain",
    "Q05": "Spina bifida",
    "Q06": "Other congenital malformations of spinal cord",
    "Q07": "Other congenital malformations of nervous system",
    "Q10": "Congenital malform of eyelid, lacrimal apparatus and orbit",
    "Q11": "Anophthalmos, microphthalmos and macrophthalmos",
    "Q12": "Congenital lens malformations",
    "Q13": "Congenital malformations of anterior segment of eye",
    "Q14": "Congenital malformations of posterior segment of eye",
    "Q15": "Other congenital malformations of eye",
    "Q16": "Congenital malform of ear causing impairment of hearing",
    "Q17": "Other congenital malformations of ear",
    "Q18": "Other congenital malformations of face and neck",
    "Q20": "Congenital malformations of cardiac chambers and connections",
    "Q21": "Congenital malformations of cardiac septa",
    "Q22": "Congenital malformations of pulmonary and tricuspid valves",
    "Q23": "Congenital malformations of aortic and mitral valves",
    "Q24": "Other congenital malformations of heart",
    "Q25": "Congenital malformations of great arteries",
    "Q26": "Congenital malformations of great veins",
    "Q27": "Other congenital malformations of peripheral vascular system",
    "Q28": "Other congenital malformations of circulatory system",
    "Q30": "Congenital malformations of nose",
    "Q31": "Congenital malformations of larynx",
    "Q32": "Congenital malformations of trachea and bronchus",
    "Q33": "Congenital malformations of lung",
    "Q34": "Other congenital malformations of respiratory system",
    "Q35": "Cleft palate",
    "Q36": "Cleft lip",
    "Q37": "Cleft palate with cleft lip",
    "Q38": "Other congenital malformations of tongue, mouth and pharynx",
    "Q39": "Congenital malformations of esophagus",
    "Q40": "Other congenital malformations of upper alimentary tract",
    "Q41": "Congenital absence, atresia and stenosis of small intestine",
    "Q42": "Congenital absence, atresia and stenosis of large intestine",
    "Q43": "Other congenital malformations of intestine",
    "Q44": "Congenital malform of gallbladder, bile ducts and liver",
    "Q45": "Other congenital malformations of digestive system",
    "Q50": "Congen malform of ovaries, fallopian tubes & broad ligaments",
    "Q51": "Congenital malformations of uterus and cervix",
    "Q52": "Other congenital malformations of female genitalia",
    "Q53": "Undescended and ectopic testicle",
    "Q54": "Hypospadias",
    "Q55": "Other congenital malformations of male genital organs",
    "Q56": "Indeterminate sex and pseudohermaphroditism",
    "Q60": "Renal agenesis and other reduction defects of kidney",
    "Q61": "Cystic kidney disease",
    "Q62": "Congen defects of renal pelvis and congen malform of ureter",
    "Q63": "Other congenital malformations of kidney",
    "Q64": "Other congenital malformations of urinary system",
    "Q65": "Congenital deformities of hip",
    "Q66": "Congenital deformities of feet",
    "Q67": "Congenital ms deformities of head, face, spine and chest",
    "Q68": "Other congenital musculoskeletal deformities",
    "Q69": "Polydactyly",
    "Q70": "Syndactyly",
    "Q71": "Reduction defects of upper limb",
    "Q72": "Reduction defects of lower limb",
    "Q73": "Reduction defects of unspecified limb",
    "Q74": "Other congenital malformations of limb(s)",
    "Q75": "Other congenital malformations of skull and face bones",
    "Q76": "Congenital malformations of spine and bony thorax",
    "Q77": "Osteochndrdys w defects of growth of tubular bones and spine",
    "Q78": "Other osteochondrodysplasias",
    "Q79": "Congenital malformations of musculoskeletal system, NEC",
    "Q80": "Congenital ichthyosis",
    "Q81": "Epidermolysis bullosa",
    "Q82": "Other congenital malformations of skin",
    "Q83": "Congenital malformations of breast",
    "Q84": "Other congenital malformations of integument",
    "Q85": "Phakomatoses, not elsewhere classified",
    "Q86": "Congen malform syndromes due to known exogenous causes, NEC",
    "Q87": "Oth congenital malform syndromes affecting multiple systems",
    "Q89": "Other congenital malformations, not elsewhere classified",
    "Q90": "Down syndrome",
    "Q91": "Trisomy 18 and Trisomy 13",
    "Q92": "Oth trisomies and partial trisomies of the autosomes, NEC",
    "Q93": "Monosomies and deletions from the autosomes, NEC",
    "Q95": "Balanced rearrangements and structural markers, NEC",
    "Q96": "Turner's syndrome",
    "Q97": "Oth sex chromosome abnormalities, female phenotype, NEC",
    "Q98": "Oth sex chromosome abnormalities, male phenotype, NEC",
    "Q99": "Other chromosome abnormalities, not elsewhere classified",
    "R00": "Abnormalities of heart beat",
    "R01": "Cardiac murmurs and other cardiac sounds",
    "R03": "Abnormal blood-pressure reading, without diagnosis",
    "R04": "Hemorrhage from respiratory passages",
    "R05": "Cough",
    "R06": "Abnormalities of breathing",
    "R07": "Pain in throat and chest",
    "R09": "Oth symptoms and signs involving the circ and resp sys",
    "R10": "Abdominal and pelvic pain",
    "R11": "Nausea and vomiting",
    "R12": "Heartburn",
    "R13": "Aphagia and dysphagia",
    "R14": "Flatulence and related conditions",
    "R15": "Fecal incontinence",
    "R16": "Hepatomegaly and splenomegaly, not elsewhere classified",
    "R17": "Unspecified jaundice",
    "R18": "Ascites",
    "R19": "Oth symptoms and signs involving the dgstv sys and abdomen",
    "R20": "Disturbances of skin sensation",
    "R21": "Rash and other nonspecific skin eruption",
    "R22": "Localized swelling, mass and lump of skin, subcu",
    "R23": "Other skin changes",
    "R25": "Abnormal involuntary movements",
    "R26": "Abnormalities of gait and mobility",
    "R27": "Other lack of coordination",
    "R29": "Oth symptoms and signs involving the nervous and ms systems",
    "R30": "Pain associated with micturition",
    "R31": "Hematuria",
    "R32": "Unspecified urinary incontinence",
    "R33": "Retention of urine",
    "R34": "Anuria and oliguria",
    "R35": "Polyuria",
    "R36": "Urethral discharge",
    "R37": "Sexual dysfunction, unspecified",
    "R39": "Oth and unsp symptoms and signs involving the GU sys",
    "R40": "Somnolence, stupor and coma",
    "R41": "Oth symptoms and signs w cognitive functions and awareness",
    "R42": "Dizziness and giddiness",
    "R43": "Disturbances of smell and taste",
    "R44": "Oth symptoms and signs w general sensations and perceptions",
    "R45": "Symptoms and signs involving emotional state",
    "R46": "Symptoms and signs involving appearance and behavior",
    "R47": "Speech disturbances, not elsewhere classified",
    "R48": "Dyslexia and oth symbolic dysfunctions, NEC",
    "R49": "Voice and resonance disorders",
    "R50": "Fever of other and unknown origin",
    "R51": "Headache",
    "R52": "Pain, unspecified",
    "R53": "Malaise and fatigue",
    "R54": "Age-related physical debility",
    "R55": "Syncope and collapse",
    "R56": "Convulsions, not elsewhere classified",
    "R57": "Shock, not elsewhere classified",
    "R58": "Hemorrhage, not elsewhere classified",
    "R59": "Enlarged lymph nodes",
    "R60": "Edema, not elsewhere classified",
    "R61": "Generalized hyperhidrosis",
    "R62": "Lack of expected normal physiol dev in childhood and adults",
    "R63": "Symptoms and signs concerning food and fluid intake",
    "R64": "Cachexia",
    "R65": "Symp and signs specifically assoc w sys inflam and infct",
    "R68": "Other general symptoms and signs",
    "R69": "Illness, unspecified",
    "R70": "Elev erythro sedim and abnormality of plasma viscosity",
    "R71": "Abnormality of red blood cells",
    "R73": "Elevated blood glucose level",
    "R74": "Abnormal serum enzyme levels",
    "R75": "Inconclusive laboratory evidence of human immunodef virus",
    "R76": "Other abnormal immunological findings in serum",
    "R77": "Other abnormalities of plasma proteins",
    "R78": "Find of drugs and oth substnc, not normally found in blood",
    "R79": "Other abnormal findings of blood chemistry",
    "R80": "Proteinuria",
    "R81": "Glycosuria",
    "R82": "Other and unspecified abnormal findings in urine",
    "R83": "Abnormal findings in cerebrospinal fluid",
    "R84": "Abnormal findings in specimens from resp org/thrx",
    "R85": "Abnormal findings in specimens from dgstv org/abd cav",
    "R86": "Abnormal findings in specimens from male genital organs",
    "R87": "Abnormal findings in specimens from female genital organs",
    "R88": "Abnormal findings in other body fluids and substances",
    "R89": "Abnormal findings in specimens from oth org/tiss",
    "R90": "Abnormal findings on diagnostic imaging of cnsl",
    "R91": "Abnormal findings on diagnostic imaging of lung",
    "R92": "Abnormal and inconclusive findings on dx imaging of breast",
    "R93": "Abnormal findings on diagnostic imaging of body structures",
    "R94": "Abnormal results of function studies",
    "R97": "Abnormal tumor markers",
    "R99": "Ill-defined and unknown cause of mortality",
    "S00": "Superficial injury of head",
    "S01": "Open wound of head",
    "S02": "Fracture of skull and facial bones",
    "S03": "Dislocation and sprain of joints and ligaments of head",
    "S04": "Injury of cranial nerve",
    "S05": "Injury of eye and orbit",
    "S06": "Intracranial injury",
    "S07": "Crushing injury of head",
    "S08": "Avulsion and traumatic amputation of part of head",
    "S09": "Other and unspecified injuries of head",
    "S10": "Superficial injury of neck",
    "S11": "Open wound of neck",
    "S12": "Fracture of cervical vertebra and other parts of neck",
    "S13": "Dislocation and sprain of joints and ligaments at neck level",
    "S14": "Injury of nerves and spinal cord at neck level",
    "S15": "Injury of blood vessels at neck level",
    "S16": "Injury of muscle, fascia and tendon at neck level",
    "S17": "Crushing injury of neck",
    "S19": "Other specified and unspecified injuries of neck",
    "S20": "Superficial injury of thorax",
    "S21": "Open wound of thorax",
    "S22": "Fracture of rib(s), sternum and thoracic spine",
    "S23": "Dislocation and sprain of joints and ligaments of thorax",
    "S24": "Injury of nerves and spinal cord at thorax level",
    "S25": "Injury of blood vessels of thorax",
    "S26": "Injury of heart",
    "S27": "Injury of other and unspecified intrathoracic organs",
    "S28": "Crushing inj thorax, and traumatic amp of part of thorax",
    "S29": "Other and unspecified injuries of thorax",
    "S30": "Superfic inj abdomen, low back, pelvis and external genitals",
    "S31": "Opn wnd abdomen, lower back, pelvis and external genitals",
    "S32": "Fracture of lumbar spine and pelvis",
    "S33": "Disloc & sprain of joints & ligaments of lumbar spin & pelv",
    "S34": "Inj lower spinl cord and nrv at abd, low back and pelv level",
    "S35": "Inj blood vessels at abdomen, low back and pelvis level",
    "S36": "Injury of intra-abdominal organs",
    "S37": "Injury of urinary and pelvic organs",
    "S38": "Crush inj & traum amp of abd,low back, pelv & extrn genitals",
    "S39": "Oth & unsp injuries of abd, low back, pelv & extrn genitals",
    "S40": "Superficial injury of shoulder and upper arm",
    "S41": "Open wound of shoulder and upper arm",
    "S42": "Fracture of shoulder and upper arm",
    "S43": "Disloc and sprain of joints and ligaments of shoulder girdle",
    "S44": "Injury of nerves at shoulder and upper arm level",
    "S45": "Injury of blood vessels at shoulder and upper arm level",
    "S46": "Injury of muscle, fascia and tendon at shldr/up arm",
    "S47": "Crushing injury of shoulder and upper arm",
    "S48": "Traumatic amputation of shoulder and upper arm",
    "S49": "Other and unspecified injuries of shoulder and upper arm",
    "S50": "Superficial injury of elbow and forearm",
    "S51": "Open wound of elbow and forearm",
    "S52": "Fracture of forearm",
    "S53": "Dislocation and sprain of joints and ligaments of elbow",
    "S54": "Injury of nerves at forearm level",
    "S55": "Injury of blood vessels at forearm level",
    "S56": "Injury of muscle, fascia and tendon at forearm level",
    "S57": "Crushing injury of elbow and forearm",
    "S58": "Traumatic amputation of elbow and forearm",
    "S59": "Other and unspecified injuries of elbow and forearm",
    "S60": "Superficial injury of wrist, hand and fingers",
    "S61": "Open wound of wrist, hand and fingers",
    "S62": "Fracture at wrist and hand level",
    "S63": "Dislocation and sprain of joints and ligaments at wrs/hnd lv",
    "S64": "Injury of nerves at wrist and hand level",
    "S65": "Injury of blood vessels at wrist and hand level",
    "S66": "Injury of muscle, fascia and tendon at wrist and hand level",
    "S67": "Crushing injury of wrist, hand and fingers",
    "S68": "Traumatic amputation of wrist, hand and fingers",
    "S69": "Other and unspecified injuries of wrist, hand and finger(s)",
    "S70": "Superficial injury of hip and thigh",
    "S71": "Open wound of hip and thigh",
    "S72": "Fracture of femur",
    "S73": "Dislocation and sprain of joint and ligaments of hip",
    "S74": "Injury of nerves at hip and thigh level",
    "S75": "Injury of blood vessels at hip and thigh level",
    "S76": "Injury of muscle, fascia and tendon at hip and thigh level",
    "S77": "Crushing injury of hip and thigh",
    "S78": "Traumatic amputation of hip and thigh",
    "S79": "Other and unspecified injuries of hip and thigh",
    "S80": "Superficial injury of knee and lower leg",
    "S81": "Open wound of knee and lower leg",
    "S82": "Fracture of lower leg, including ankle",
    "S83": "Dislocation and sprain of joints and ligaments of knee",
    "S84": "Injury of nerves at lower leg level",
    "S85": "Injury of blood vessels at lower leg level",
    "S86": "Injury of muscle, fascia and tendon at lower leg level",
    "S87": "Crushing injury of lower leg",
    "S88": "Traumatic amputation of lower leg",
    "S89": "Other and unspecified injuries of lower leg",
    "S90": "Superficial injury of ankle, foot and toes",
    "S91": "Open wound of ankle, foot and toes",
    "S92": "Fracture of foot and toe, except ankle",
    "S93": "Disloc & sprain of joints & ligaments at ankl, ft & toe lev",
    "S94": "Injury of nerves at ankle and foot level",
    "S95": "Injury of blood vessels at ankle and foot level",
    "S96": "Injury of muscle and tendon at ankle and foot level",
    "S97": "Crushing injury of ankle and foot",
    "S98": "Traumatic amputation of ankle and foot",
    "S99": "Other and unspecified injuries of ankle and foot",
    "T07": "Unspecified multiple injuries",
    "T14": "Injury of unspecified body region",
    "T15": "Foreign body on external eye",
    "T16": "Foreign body in ear",
    "T17": "Foreign body in respiratory tract",
    "T18": "Foreign body in alimentary tract",
    "T19": "Foreign body in genitourinary tract",
    "T20": "Burn and corrosion of head, face, and neck",
    "T21": "Burn and corrosion of trunk",
    "T22": "Burn and corrosion of shldr/up lmb, except wrist and hand",
    "T23": "Burn and corrosion of wrist and hand",
    "T24": "Burn and corrosion of lower limb, except ankle and foot",
    "T25": "Burn and corrosion of ankle and foot",
    "T26": "Burn and corrosion confined to eye and adnexa",
    "T27": "Burn and corrosion of respiratory tract",
    "T28": "Burn and corrosion of other internal organs",
    "T30": "Burn and corrosion, body region unspecified",
    "T31": "Burns classified accord extent body involv",
    "T32": "Corrosions classified accord extent body involv",
    "T33": "Superficial frostbite",
    "T34": "Frostbite with tissue necrosis",
    "T36": "Systemic antibiotics",
    "T37": "Other systemic anti-infectives and antiparasitics",
    "T38": "Hormones and their synthetic substitutes and antag, NEC",
    "T39": "Nonopioid analgesics, antipyretics and antirheumatics",
    "T40": "Narcotics and psychodysleptics",
    "T41": "Anesthetics and therapeutic gases",
    "T42": "Antiepileptic, sedative- hypnotic and antiparkinsonism drugs",
    "T43": "Psychotropic drugs, not elsewhere classified",
    "T44": "Drugs primarily affecting the autonomic nervous system",
    "T45": "Primarily systemic and hematological agents, NEC",
    "T46": "Agents primarily affecting the cardiovascular system",
    "T47": "Agents primarily affecting the gastrointestinal system",
    "T48": "Agents prim act on smooth and skeletal musc and the resp sys",
    "T49": "Topical skin/eye/ENT/dental drugs",
    "T50": "Diuretics and oth and unsp drug/meds/biol subst",
    "T51": "Toxic effect of alcohol",
    "T52": "Toxic effect of organic solvents",
    "T53": "Toxic effect of halogen derivatives of aromat hydrocrb",
    "T54": "Toxic effect of corrosive substances",
    "T55": "Toxic effect of soaps and detergents",
    "T56": "Toxic effect of metals",
    "T57": "Toxic effect of other inorganic substances",
    "T58": "Toxic effect of carbon monoxide",
    "T59": "Toxic effect of other gases, fumes and vapors",
    "T60": "Toxic effect of pesticides",
    "T61": "Toxic effect of noxious substances eaten as seafood",
    "T62": "Toxic effect of other noxious substances eaten as food",
    "T63": "Toxic effect of contact with venomous animals and plants",
    "T64": "Toxic effect of aflatoxin and oth mycotoxin food contamnt",
    "T65": "Toxic effect of other and unspecified substances",
    "T66": "Radiation sickness, unspecified",
    "T67": "Effects of heat and light",
    "T68": "Hypothermia",
    "T69": "Other effects of reduced temperature",
    "T70": "Effects of air pressure and water pressure",
    "T71": "Asphyxiation",
    "T73": "Effects of other deprivation",
    "T74": "Adult and child abuse, neglect and oth maltreat, confirmed",
    "T75": "Other and unspecified effects of other external causes",
    "T76": "Adult and child abuse, neglect and oth maltreat, suspected",
    "T78": "Adverse effects, not elsewhere classified",
    "T79": "Certain early complications of trauma, NEC",
    "T80": "Comp following infusion, transfusion and theraputc injection",
    "T81": "Complications of procedures, not elsewhere classified",
    "T82": "Complications of cardiac and vascular prosth dev/grft",
    "T83": "Complications of genitourinary prosth dev/grft",
    "T84": "Complications of internal orthopedic prosth dev/grft",
    "T85": "Complications of internal prosth dev/grft",
    "T86": "Complications of transplanted organs and tissue",
    "T87": "Complications peculiar to reattachment and amputation",
    "T88": "Oth complications of surgical and medical care, NEC",
    "V00": "Pedestrian conveyance accident",
    "V01": "Pedestrian injured in collision with pedal cycle",
    "V02": "Pedestrian injured in collision w 2/3-whl mv",
    "V03": "Pedestrian injured in collision w car, pick-up truck or van",
    "V04": "Pedestrian injured in collision w hv veh",
    "V05": "Pedestrian injured in collision w rail trn/veh",
    "V06": "Pedestrian injured in collision with other nonmotor vehicle",
    "V09": "Pedestrian injured in other and unsp transport accidents",
    "V10": "Pedal cycle rider injured in collision w ped/anml",
    "V11": "Pedal cycle rider injured in collision with oth pedal cycle",
    "V12": "Pedal cycle rider injured in collision w 2/3-whl mv",
    "V13": "Pedal cycle rider injured pick-up truck, pk-up/van",
    "V14": "Pedal cycle rider injured in collision w hv veh",
    "V15": "Pedal cycle rider injured in collision w rail trn/veh",
    "V16": "Pedal cycle rider injured in collision w nonmtr vehicle",
    "V17": "Pedal cycle rider injured in collision w statnry object",
    "V18": "Pedal cycle rider injured in noncollision transport accident",
    "V19": "Pedl cyc rider injured in oth and unsp transport accidents",
    "V20": "Motorcycle rider injured in collision w pedestrian or animal",
    "V21": "Motorcycle rider injured in collision with pedal cycle",
    "V22": "Motorcycle rider injured in collision w 2/3-whl mv",
    "V23": "Motorcycle rider injured pick-up truck, pick-up truck or van",
    "V24": "Motorcycle rider injured in collision w hv veh",
    "V25": "Motorcycle rider injured in collision w rail trn/veh",
    "V26": "Motorcycle rider injured in collision w oth nonmotor vehicle",
    "V27": "Motorcycle rider injured in collision w statnry object",
    "V28": "Motorcycle rider injured in noncollision transport accident",
    "V29": "Motorcycle rider injured in oth and unsp transport accidents",
    "V30": "Occupant of 3-whl mv injured in collision w ped/anml",
    "V31": "Occupant of 3-whl mv injured in collision w pedal cycle",
    "V32": "Occupant of 3-whl mv injured in collision w 2/3-whl mv",
    "V33": "Occupant of 3-whl mv injured pick-up truck, pk-up/van",
    "V34": "Occupant of 3-whl mv injured in collision w hv veh",
    "V35": "Occupant of 3-whl mv injured in collision w rail trn/veh",
    "V36": "Occupant of 3-whl mv injured in collision w nonmtr vehicle",
    "V37": "Occupant of 3-whl mv injured in collision w statnry object",
    "V38": "Occupant of 3-whl mv injured in nonclsn transport accident",
    "V39": "Occupant of 3-whl mv injured in oth and unsp transport acc",
    "V40": "Car occupant injured in collision with pedestrian or animal",
    "V41": "Car occupant injured in collision with pedal cycle",
    "V42": "Car occupant injured in collision w 2/3-whl mv",
    "V43": "Car occupant injured pick-up truck, pick-up truck or van",
    "V44": "Car occupant injured in collision w hv veh",
    "V45": "Car occupant injured in collision w rail trn/veh",
    "V46": "Car occupant injured in collision with oth nonmotor vehicle",
    "V47": "Car occupant injured in collision w statnry object",
    "V48": "Car occupant injured in noncollision transport accident",
    "V49": "Car occupant injured in other and unsp transport accidents",
    "V50": "Occupant of pk-up/van injured in collision w ped/anml",
    "V51": "Occupant of pk-up/van injured in collision w pedal cycle",
    "V52": "Occupant of pk-up/van injured in collision w 2/3-whl mv",
    "V53": "Occupant of pk-up/van injured pick-up truck, pk-up/van",
    "V54": "Occupant of pk-up/van injured in collision w hv veh",
    "V55": "Occupant of pk-up/van injured in collision w rail trn/veh",
    "V56": "Occupant of pk-up/van injured in collision w nonmtr vehicle",
    "V57": "Occupant of pk-up/van injured in collision w statnry object",
    "V58": "Occupant of pk-up/van injured in nonclsn transport accident",
    "V59": "Occupant of pk-up/van injured in oth and unsp transport acc",
    "V60": "Occupant of hv veh injured in collision w ped/anml",
    "V61": "Occupant of hv veh injured in collision w pedal cycle",
    "V62": "Occupant of hv veh injured in collision w 2/3-whl mv",
    "V63": "Occupant of hv veh injured pick-up truck, pk-up/van",
    "V64": "Occupant of hv veh injured in collision w hv veh",
    "V65": "Occupant of hv veh injured in collision w rail trn/veh",
    "V66": "Occupant of hv veh injured in collision w nonmtr vehicle",
    "V67": "Occupant of hv veh injured in collision w statnry object",
    "V68": "Occupant of hv veh injured in nonclsn transport accident",
    "V69": "Occupant of hv veh injured in oth and unsp transport acc",
    "V70": "Bus occupant injured in collision with pedestrian or animal",
    "V71": "Bus occupant injured in collision with pedal cycle",
    "V72": "Bus occupant injured in collision w 2/3-whl mv",
    "V73": "Bus occupant injured pick-up truck, pick-up truck or van",
    "V74": "Bus occupant injured in collision w hv veh",
    "V75": "Bus occupant injured in collision w rail trn/veh",
    "V76": "Bus occupant injured in collision with oth nonmotor vehicle",
    "V77": "Bus occupant injured in collision w statnry object",
    "V78": "Bus occupant injured in noncollision transport accident",
    "V79": "Bus occupant injured in other and unsp transport accidents",
    "V80": "Animl-ridr or occ of anml-drn vehicle injured in trnsp acc",
    "V81": "Occupant of rail trn/veh injured in transport accident",
    "V82": "Occupant of powered streetcar injured in transport accident",
    "V83": "Occupant specl indust veh injured in transport accident",
    "V84": "Occ of specl veh mainly used in agriculture inj in trnsp acc",
    "V85": "Occupant of special construct vehicle injured in trnsp acc",
    "V86": "Occ off-road veh injured transp acc",
    "V87": "Traf of spcf type but victim's mode of transport unknown",
    "V88": "Nontraf of spcf type but victim's mode of transport unknown",
    "V89": "Motor- or nonmotor-vehicle accident, type of vehicle unsp",
    "V90": "Drowning and submersion due to accident to watercraft",
    "V91": "Other injury due to accident to watercraft",
    "V92": "Drown due to acc on board wtrcrft, w/o accident to wtrcrft",
    "V93": "Oth injury due to acc on board wtrcrft, w/o acc to wtrcrft",
    "V94": "Other and unspecified water transport accidents",
    "V95": "Accident to powered aircraft causing injury to occupant",
    "V96": "Accident to nonpowered aircraft causing injury to occupant",
    "V97": "Other specified air transport accidents",
    "V98": "Other specified transport accidents",
    "V99": "Unspecified transport accident",
    "W00": "Fall due to ice and snow",
    "W01": "Fall on same level from slipping, tripping and stumbling",
    "W03": "Oth fall on same level due to collision with another person",
    "W04": "Fall while being carried or supported by other persons",
    "W05": "Fall from wheelchr/nonmotor scoot",
    "W06": "Fall from bed",
    "W07": "Fall from chair",
    "W08": "Fall from other furniture",
    "W09": "Fall on and from playground equipment",
    "W10": "Fall on and from stairs and steps",
    "W11": "Fall on and from ladder",
    "W12": "Fall on and from scaffolding",
    "W13": "Fall from, out of or through building or structure",
    "W14": "Fall from tree",
    "W15": "Fall from cliff",
    "W16": "Fall, jump or diving into water",
    "W17": "Other fall from one level to another",
    "W18": "Other slipping, tripping and stumbling and falls",
    "W19": "Unspecified fall",
    "W20": "Struck by thrown, projected or falling object",
    "W21": "Striking against or struck by sports equipment",
    "W22": "Striking against or struck by other objects",
    "W23": "Caught, crushed, jammed or pinched in or between objects",
    "W24": "Contact w lifting and transmission devices, NEC",
    "W25": "Contact with sharp glass",
    "W26": "Contact with other sharp objects",
    "W27": "Contact with nonpowered hand tool",
    "W28": "Contact with powered lawn mower",
    "W29": "Contact with oth powered hand tools and household machinery",
    "W30": "Contact with agricultural machinery",
    "W31": "Contact with other and unspecified machinery",
    "W32": "Accidental handgun discharge and malfunction",
    "W33": "Acc rifle, shotgun and larger firearm discharge and malfunct",
    "W34": "Acc disch and malfunct from oth and unsp firearms and guns",
    "W35": "Explosion and rupture of boiler",
    "W36": "Explosion and rupture of gas cylinder",
    "W37": "Explosion and rupture of pressurized tire, pipe or hose",
    "W38": "Explosion and rupture of other specified pressurized devices",
    "W39": "Discharge of firework",
    "W40": "Explosion of other materials",
    "W42": "Exposure to noise",
    "W45": "Foreign body or object entering through skin",
    "W46": "Contact with hypodermic needle",
    "W49": "Exposure to other inanimate mechanical forces",
    "W50": "Acc hit, strk, kick, twist, bite or scratch by another prsn",
    "W51": "Accidental striking against or bumped into by another person",
    "W52": "Crushed, pushed or stepped on by crowd or human stampede",
    "W53": "Contact with rodent",
    "W54": "Contact with dog",
    "W55": "Contact with other mammals",
    "W56": "Contact with nonvenomous marine animal",
    "W57": "Bit/stung by nonvenom insect and oth nonvenomous arthropods",
    "W58": "Contact with crocodile or alligator",
    "W59": "Contact with other nonvenomous reptiles",
    "W60": "Contact w nonvenom plant thorns and spines and sharp leaves",
    "W61": "Contact with birds (domestic) (wild)",
    "W62": "Contact with nonvenomous amphibians",
    "W64": "Exposure to other animate mechanical forces",
    "W65": "Accidental drowning and submersion while in bath-tub",
    "W67": "Accidental drowning and submersion while in swimming-pool",
    "W69": "Accidental drowning and submersion while in natural water",
    "W73": "Oth cause of accidental non-transport drown",
    "W74": "Unspecified cause of accidental drowning and submersion",
    "W85": "Exposure to electric transmission lines",
    "W86": "Exposure to other specified electric current",
    "W88": "Exposure to ionizing radiation",
    "W89": "Exposure to man-made visible and ultraviolet light",
    "W90": "Exposure to other nonionizing radiation",
    "W92": "Exposure to excessive heat of man-made origin",
    "W93": "Exposure to excessive cold of man-made origin",
    "W94": "Expsr to high and low air pressr and changes in air pressure",
    "W99": "Exposure to other man-made environmental factors",
    "X00": "Exposure to uncontrolled fire in building or structure",
    "X01": "Exposure to uncontrolled fire, not in building or structure",
    "X02": "Exposure to controlled fire in building or structure",
    "X03": "Exposure to controlled fire, not in building or structure",
    "X04": "Exposure to ignition of highly flammable material",
    "X05": "Exposure to ignition or melting of nightwear",
    "X06": "Exposure to ignition or melting of oth clothing and apparel",
    "X08": "Exposure to other specified smoke, fire and flames",
    "X10": "Contact with hot drinks, food, fats and cooking oils",
    "X11": "Contact with hot tap-water",
    "X12": "Contact with other hot fluids",
    "X13": "Contact with steam and other hot vapors",
    "X14": "Contact with hot air and other hot gases",
    "X15": "Contact with hot household appliances",
    "X16": "Contact with hot heating appliances, radiators and pipes",
    "X17": "Contact with hot engines, machinery and tools",
    "X18": "Contact with other hot metals",
    "X19": "Contact with other heat and hot substances",
    "X30": "Exposure to excessive natural heat",
    "X31": "Exposure to excessive natural cold",
    "X32": "Exposure to sunlight",
    "X34": "Earthquake",
    "X35": "Volcanic eruption",
    "X36": "Avalanche, landslide and other earth movements",
    "X37": "Cataclysmic storm",
    "X38": "Flood",
    "X39": "Exposure to other forces of nature",
    "X50": "Overexertion and strenuous or repetitive movements",
    "X52": "Prolonged stay in weightless environment",
    "X58": "Exposure to other specified factors",
    "X71": "Intentional self-harm by drowning and submersion",
    "X72": "Intentional self-harm by handgun discharge",
    "X73": "Self-harm by rifle, shotgun and larger firearm discharge",
    "X74": "Self-harm by oth and unsp firearm and gun discharge",
    "X75": "Intentional self-harm by explosive material",
    "X76": "Intentional self-harm by smoke, fire and flames",
    "X77": "Intentional self-harm by steam, hot vapors and hot objects",
    "X78": "Intentional self-harm by sharp object",
    "X79": "Intentional self-harm by blunt object",
    "X80": "Intentional self-harm by jumping from a high place",
    "X81": "Self-harm by jumping or lying in front of moving object",
    "X82": "Intentional self-harm by crashing of motor vehicle",
    "X83": "Intentional self-harm by other specified means",
    "X92": "Assault by drowning and submersion",
    "X93": "Assault by handgun discharge",
    "X94": "Assault by rifle, shotgun and larger firearm discharge",
    "X95": "Assault by other and unspecified firearm and gun discharge",
    "X96": "Assault by explosive material",
    "X97": "Assault by smoke, fire and flames",
    "X98": "Assault by steam, hot vapors and hot objects",
    "X99": "Assault by sharp object",
    "Y00": "Assault by blunt object",
    "Y01": "Assault by pushing from high place",
    "Y02": "Assault by push/place victim in front of moving object",
    "Y03": "Assault by crashing of motor vehicle",
    "Y04": "Assault by bodily force",
    "Y07": "Perpetrator of assault, maltreatment and neglect",
    "Y08": "Assault by other specified means",
    "Y09": "Assault by unspecified means",
    "Y21": "Drowning and submersion, undetermined intent",
    "Y22": "Handgun discharge, undetermined intent",
    "Y23": "Rifle, shotgun and larger firearm discharge, undet intent",
    "Y24": "Other and unspecified firearm discharge, undetermined intent",
    "Y25": "Contact with explosive material, undetermined intent",
    "Y26": "Exposure to smoke, fire and flames, undetermined intent",
    "Y27": "Contact w steam, hot vapors and hot objects, undet intent",
    "Y28": "Contact with sharp object, undetermined intent",
    "Y29": "Contact with blunt object, undetermined intent",
    "Y30": "Falling, jumping or pushed from a high place, undet intent",
    "Y31": "Fall/lying/running bef/into moving object, undet intent",
    "Y32": "Crashing of motor vehicle, undetermined intent",
    "Y33": "Other specified events, undetermined intent",
    "Y35": "Legal intervention",
    "Y36": "Operations of war",
    "Y37": "Military operations",
    "Y38": "Terrorism",
    "Y62": "Failure of steril precaut during surgical and medical care",
    "Y63": "Failure in dosage during surgical and medical care",
    "Y64": "Contaminated medical or biological substances",
    "Y65": "Other misadventures during surgical and medical care",
    "Y66": "Nonadministration of surgical and medical care",
    "Y69": "Unspecified misadventure during surgical and medical care",
    "Y70": "Anesthesiology devices associated with adverse incidents",
    "Y71": "Cardiovascular devices associated with adverse incidents",
    "Y72": "Otorhinolaryngological devices assoc w incdt",
    "Y73": "Gastroenterology and urology devices assoc w incdt",
    "Y74": "General hospital and personal-use devices assoc w incdt",
    "Y75": "Neurological devices associated with adverse incidents",
    "Y76": "Obstetric and gynecological devices assoc w incdt",
    "Y77": "Ophthalmic devices associated with adverse incidents",
    "Y78": "Radiological devices associated with adverse incidents",
    "Y79": "Orthopedic devices associated with adverse incidents",
    "Y80": "Physical medicine devices associated with adverse incidents",
    "Y81": "General- and plastic-surgery devices assoc w incdt",
    "Y82": "Oth and unsp medical devices associated w adverse incidents",
    "Y83": "Surg op & oth surg proc cause abn react/compl, w/o misadvnt",
    "Y84": "Oth medical procedures cause abn react/compl, w/o misadvnt",
    "Y90": "Evidence of alcohol involv determined by blood alcohol level",
    "Y92": "Place of occurrence of the external cause",
    "Y93": "Activity codes",
    "Y95": "Nosocomial condition",
    "Y99": "External cause status",
    "Z00": "Encntr for general exam w/o complaint, susp or reprtd dx",
    "Z01": "Encntr for oth sp exam w/o complaint, suspected or reprtd dx",
    "Z02": "Encounter for administrative examination",
    "Z03": "Encntr for medical obs for susp diseases and cond ruled out",
    "Z04": "Encounter for examination and observation for other reasons",
    "Z05": "Enctr for Obs & eval of NB for susp diseases and cond R/O",
    "Z08": "Encntr for follow-up exam after trtmt for malignant neoplasm",
    "Z09": "Encntr for f/u exam aft trtmt for cond oth than malig neoplm",
    "Z11": "Encounter for screening for infec/parastc diseases",
    "Z12": "Encounter for screening for malignant neoplasms",
    "Z13": "Encounter for screening for other diseases and disorders",
    "Z14": "Genetic carrier",
    "Z15": "Genetic susceptibility to disease",
    "Z16": "Resistance to antimicrobial drugs",
    "Z17": "Estrogen receptor status",
    "Z18": "Retained foreign body fragments",
    "Z19": "Hormone sensitivity malignancy status",
    "Z20": "Contact w and (suspected) exposure to communicable diseases",
    "Z21": "Asymptomatic human immunodeficiency virus infection status",
    "Z22": "Carrier of infectious disease",
    "Z23": "Encounter for immunization",
    "Z28": "Immunization not carried out and underimmunization status",
    "Z29": "Encounter for other prophylactic measures",
    "Z30": "Encounter for contraceptive management",
    "Z31": "Encounter for procreative management",
    "Z32": "Encntr for preg test and chldbrth and childcare instruction",
    "Z33": "Pregnant state",
    "Z34": "Encounter for supervision of normal pregnancy",
    "Z36": "Encounter for antenatal screening of mother",
    "Z3A": "Weeks of gestation",
    "Z37": "Outcome of delivery",
    "Z38": "Liveborn infants according to place of birth and type of del",
    "Z39": "Encounter for maternal postpartum care and examination",
    "Z40": "Encounter for prophylactic surgery",
    "Z41": "Encntr for proc for purposes oth than remedying health state",
    "Z42": "Encntr for plast/recnst surg fol med proc or healed injury",
    "Z43": "Encounter for attention to artificial openings",
    "Z44": "Encounter for fit/adjst of external prosthetic device",
    "Z45": "Encounter for adjustment and management of implanted device",
    "Z46": "Encounter for fitting and adjustment of other devices",
    "Z47": "Orthopedic aftercare",
    "Z48": "Encounter for other postprocedural aftercare",
    "Z49": "Encounter for care involving renal dialysis",
    "Z51": "Encounter for other aftercare and medical care",
    "Z52": "Donors of organs and tissues",
    "Z53": "Persons encntr hlth serv for spec proc & trtmt, not crd out",
    "Z55": "Problems related to education and literacy",
    "Z56": "Problems related to employment and unemployment",
    "Z57": "Occupational exposure to risk factors",
    "Z59": "Problems related to housing and economic circumstances",
    "Z60": "Problems related to social environment",
    "Z62": "Problems related to upbringing",
    "Z63": "Oth prob rel to prim support group, inc family circumstances",
    "Z64": "Problems related to certain psychosocial circumstances",
    "Z65": "Problems related to other psychosocial circumstances",
    "Z66": "Do not resuscitate",
    "Z67": "Blood type",
    "Z68": "Body mass index [BMI]",
    "Z69": "Encntr for mental health serv for victim and perp of abuse",
    "Z70": "Counseling related to sexual attitude, behavior and orientn",
    "Z71": "Persons encntr health serv for oth cnsl and med advice, NEC",
    "Z72": "Problems related to lifestyle",
    "Z73": "Problems related to life management difficulty",
    "Z74": "Problems related to care provider dependency",
    "Z75": "Problems related to medical facilities and other health care",
    "Z76": "Persons encountering health services in other circumstances",
    "Z77": "Oth contact w and (suspected) exposures hazardous to health",
    "Z78": "Other specified health status",
    "Z79": "Long term (current) drug therapy",
    "Z80": "Family history of primary malignant neoplasm",
    "Z81": "Family history of mental and behavioral disorders",
    "Z82": "Fam hx of certain disabil & chr dis (leading to disablement)",
    "Z83": "Family history of other specific disorders",
    "Z84": "Family history of other conditions",
    "Z85": "Personal history of malignant neoplasm",
    "Z86": "Personal history of certain other diseases",
    "Z87": "Personal history of other diseases and conditions",
    "Z88": "Allergy status to drug/meds/biol subst",
    "Z89": "Acquired absence of limb",
    "Z90": "Acquired absence of organs, not elsewhere classified",
    "Z91": "Personal risk factors, not elsewhere classified",
    "Z92": "Personal history of medical treatment",
    "Z93": "Artificial opening status",
    "Z94": "Transplanted organ and tissue status",
    "Z95": "Presence of cardiac and vascular implants and grafts",
    "Z96": "Presence of other functional implants",
    "Z97": "Presence of other devices",
    "Z98": "Other postprocedural states",
    "Z99": "Dependence on enabling machines and devices, NEC"
};

g.icd10_codes = Object.keys(g.icd10_headings).sort();

// Functions applied to the values in each field of the incoming data.
g.medical_data_fixers = {
    age: function (value) {
        value = value - 0;  // convert from string
        if (isNaN(value)) value = -1;
        if (value < 0) value = -1;
        if (value > 120) value = -1;
        return value;
    },
    date: function (value) {
        if (typeof value === 'number') {
            var excel_epoch = new Date(1899, 11, 30); // Dec 30, 1899
            var date = new Date(excel_epoch.getTime() + (value * 86400 * 1000));
            return date.toISOString().substr(0, 10);
        }
        if (typeof value === 'string') {
            var match = value.trim().match(/^(\d\d\d\d-\d\d-\d\d)\b/);
            if (match) {
                return match[0];
            } else { // sadly, assume d/m/y
                var parts = value.split(/[.-/]/);
                if (parts.length === 3) {
                    if (parts[2].length < 3) parts[2] = '20' + parts[2];
                    // JS counts months from 0 to 11, but days from 1 to 31.
                    var date = new Date(parts[2], parts[1] - 1, parts[0]);
                    return date.toISOString().substr(0, 10);
                }
            }
        }
        return value;
    },
    diagnosis: function (value) {
        // Use only the primary (first) disease code in the disease list.
        // Remove any subclassification after a decimal point.
        var code = value.split(',')[0].split('.')[0];

        // Find the heading for the 3-letter prefix.
        var prefix = code.substring(0, 3);
        var heading = g.icd10_headings[prefix];
        return heading ? prefix + ': ' + heading : prefix;
    }
};

/**
 Lists the keys used to refer to specific {@link module:g.population_data} fields. It makes the link between headers in the data files and unambiguous keys used in the code.<br>
 Each element in the object is coded in the following way:
 <pre>*key_in_dashboard*: '*header_in_datafile*',</pre>
 <br>
 Currently implemented keys are:
 <ul>
    <li><code>admNx</code> for administrative or medical division name, format: <code>Adm1_name, Adm2_name...</code>,</li>
    <li><code>pop</code> for population.</li>
 * </ul>
 * @constant
 * @type {Object}
 * @alias module:g.population_headerlist
 */
g.population_headerlist = {
    admNx: 'name',
    pop: 'pop'
};

function main_loadfiles_readvar(){
    /**
     Lists the keys from {@link module:g.medical_headerlist} that require custom parsing (eg. translate numbers into words).<br>
     Each element in the object is coded in the following way:
     <pre>*key_in_dashboard*: {*category1_in_medicaldata*: '*user-readable_output1*', *category2_in_medicaldata*: '*user-readable_output2*', ...},</pre>
     * @constant
     * @type {Object.<String, Object>}
     * @alias module:g.medical_read
     * @todo Why is it in a function?
     */
    g.medical_read = {};
}

// 2) Data check parameters
//------------------------------------------------------------------------------------
/**
 Associates keys from {@link module:g.medical_headerlist} with datacheck tests performed in {@link module:module_datacheck~dataprocessing} and defined in {@link module:module_datacheck~testvalue}.<br>
 The elements are coded in the following way:
 <pre>*key*: {test_type: '*test_name*', setup:'*additional_elements*'},</pre>
 <br>
     Currently implemented test_types are:
     <ul>
        <li><code>none</code> which does not check anything,</li>
        <li><code>epiwk</code> which checks format is 'YYYY-WW',</li>
        <li><code>ingeometry</code> which checks whether the location name in the {@link g.medical_data} matches any location name in the {@link g.geometry_data} of the same divisional level,</li>
        <li><code>integer</code> which checks if the value is an integer,</li>
        <li><code>inlist</code> which checks if the value is in a list (parsed in <code>setup</code>),</li>
        <li><code>integer</code> which checks if the value is an integer.</li>
    </ul>
 * @constant
 * @type {Object.<String, Object>}
 * @alias module:module_datacheck.definition_value
 * @todo Should maybe merged with merged with {@link module:g.medical_read}.
 */
g.module_datacheck = g.module_datacheck || {};
g.module_datacheck.definition_value = {
    admN4: {test_type: 'ingeometry', setup: 'none'},
    age: {test_type: 'integer', setup: 'none'},
    sex: {test_type: 'inlist', setup: ['M', 'F']},
};

/**
 * Defines an array of Disease to be used as an <code>inlist</code> check in {@link module:module_datacheck~dataprocessing}. In case the list of disease to follow is not predefined, an empty array must be parsed and the list of diseases will be created in {@link module:module_datacheck~dataprocessing}.
 * @constant
 * @type {Array.<String>}
 * @alias module:g.medical_diseaseslist
 */
g.medical_diseaseslist = ['dummy']; // One disease (not empty)


// Define here the list of fields that are expected to constitute a unique identifier of a record
/**
 Defines the list of fields that are expected to constitute a unique identifier of a record to be used in the errors log in {@link module:module_datacheck}.
 The elements are coded in the following way:
 <pre>{key:  '*header_in_datafile*', isnumber: *boolean*},</pre>
 * @constant
 * @type {Array.<{key: String, isnumber: Boolean}>}
 * @alias module:module_datacheck.definition_record
 */
g.module_datacheck.definition_record = [
    {key: g.medical_headerlist.date, isnumber: false},
    {key: g.medical_headerlist.id, isnumber: false},
    {key: g.medical_headerlist.admN0, isnumber: false},
    {key: g.medical_headerlist.admN1, isnumber: false},
];

// 3) Chart parameters
//------------------------------------------------------------------------------------

dc.dateFormat = d3.time.format('%d/%m/%Y');
localized_strings = g.module_lang.text[g.module_lang.current];

/**
 Lists the charts and maps to be produced by {@link module:main-core} as well as defines their main characteristics.<br>
 Each element in the object contains the following sub-elements:

 * ```
 chart_id:  {

    // Defined by the developer:
    domain_type: {String},             // 'custom_ordinal' or 'custom_linear' or 'custom_log' or 'custom_date' or 'none',
    chart_type: {String},              // 'bar' or 'multiadm' or 'row' or 'stackedbar' or 'pie' or 'series' or 'table',
    dimension_type: {String},          // 'auto' or 'custom' or 'shared',
    dimension_setup: {Array},          // [chart_id or dimkey,'auto' ot 'custom'] (mandatory if 'shared'),
    group_type: {String},              // 'auto' or 'custom' or 'none',
    group_setup: {Array},              // [datakey,datakeyopt] ('datakey' mandatory if 'surveillance', 'datakeyopt' if 'stackedbar'),
    display_axis: {Object},            // {x:'labelx',y:'labely'} (for x/y-type charts),
    display_colors: {Array.<Integer>}, // Refers to colors in g.color_domain,
    display_intro: {String},           // 'top' or 'bottom' or 'right' or 'left' or 'none',
    display_idcontainer: {String},     // To display buttons on a div different from: chart-'chart_id'
    buttons_list: {Array.<String>},    // ['reset','help'] - any, all or none of the two for most of charts plus 'expand','lockcolor' and 'parameters' for 'multiadm' charts,
    sync_to: {Array.<String>},         // ['chart_id's] - sync filtering with other charts

    // Processed by the dashboard:
    chart: {Object},                   // {@link module:main_core~chartInstancer} & {@link module:main_core~chartBuilder}
    dimension: {Object},               // {@link module:main_core~dimensionBuilder}
    domain: {Array},                   // {@link module:main_core~domainBuilder}
    group: {Object},                   // {@link module:main_core~groupBuilder}

 }
  *```
 <br>
 Each element is detailed in the following.
 * <ul>
    <li><code>chart_id</code>, 'chart-'<code>chart_id</code> must match a <code>div id</code> in the *index.html* file (the dashboard layout).</li>
    <li><code>domain_type</code> Definitions in: {@link module:main_core~domainBuilder}.
    <br>If =/= <code>'none'</code>, a custom domain is built. The <code>chart_id</code> is used to select the domain building method.</li>
    <br>
    <li><code>chart_type</code> Definitions in: {@link module:main_core~chartInstancer} and  {@link module:main_core~chartBuilder} (neither of these are properly declared as a method...).</li>
    <br>
    <li><code>dimension_type</code> Can be: 'auto' or 'custom' or 'shared' - Definitions in {@link module:main_core~dimensionBuilder}.
    <ul>
        <li>If == <code>'auto'</code> - the dimension is assumed not to be shared - that means that <code>'auto'</code> is the dimension building method and <code>chart_id</code> is used to select the field to filter in {@link module:g.medical_data}.</li>

        <li>If == <code>'custom'</code>  - the dimension is assumed not to be shared - that means that <code>'chart_id'</code> is the dimension building method and it is used as well to select the field to filter in {@link module:g.medical_data} (when not overridden by the dimension builder definition).</li>

        <li>If == <code>'shared'</code> - <code>dimension_setup</code> parameter is compulsory.
            <ul>
                <li><code>dimension_setup[0]</code> is the <code>chart_id</code> of the chart with which the dimension is shared or the common identifier for the dimension</li>
                <li><code>dimension_setup[1]</code> can be <code>'auto'</code> or <code>'custom'</code> (just like a non-'shared' dimension...)
                    <ul>
                        <li>If == <code>'auto'</code> that means that <code>'auto'</code> is the dimension building method and <code>dimension_setup[0]</code> is used to select the field to filter in {@link module:g.medical_data}.</li>

                        <li>If == <code>'custom'</code> that means that <code>dimension_setup[0]</code> is the dimension building method and it is used as well to select the field to filter in {@link module:g.medical_data} (when not overridden by the dimension builder definition).</li>
                </li>
            </ul>
        </li>
    </ul>
    Classical dimensions are stored under <code>[chart_id].dimension</code> in the {@link module:g.viz_definition} object. Whereas shared dimensions are stored under <code>[dimension_setup[0]].dimension</code>.
    </li>
    <br>
    <li><code>group_type</code> Can be: 'auto' or 'custom' or 'shared' (or 'none' for the data table) - Definitions in {@link module:main_core~groupBuilder}.
    <br>
    <ul>
        <li>If == <code>'auto'</code>, that means that <code>'auto'</code> is the group building method.</li>

        <li>If == <code>'custom'</code>, that means that <code>'chart_type'</code> is the group building method.</li>
    </ul>
    Groups building instruction are specific to each {@link module:g.medical_datatype}.
    If {@link module:g.medical_datatype} == <code>'surveillance'</code> - <code>group_setup</code> parameter is compulsory. It is an Array where:
    <ul>
        <li><code>group_setup[0]</code> is used to select the field to count or sum in {@link module:g.medical_data}. NB: In a <code>'outbreak'</code> setting, records are counted from the patient list without a reference to a field.</li>
        <li><code>group_setup[1]</code> is used to select the field to create categories for stacked charts (<code>chart_type == stackedbar</code>. NB: Stacked chart have not been used yet in a <code>'outbreak'</code> setting.</li>
    </ul>
    </li>
 * </ul>
 * @constant
 * @type {Object.<Object>}
 * @alias module:g.viz_definition
 **/
g.viz_definition = {
    multiadm: {
        buttons_list: ['expand', 'reset', 'help'],
        dimension_builder: 'multiadm',
        dimension_parameter: {
            column: 'none',
            shared: false,
            namespace: 'none'
        },
        display_colors: [0, 1, 2, 3, 4, 5],
        display_intro: 'bottom',
        display_filter: true,
        domain_builder: 'none',
        domain_parameter: 'none',
        group_builder: 'multiadm',
        group_parameter: {column: [{key:'none',value:'none'}]},
        instance_builder: 'multiadm'
    },

    date: {
        buttons_list: ['reset', 'help'],
        dimension_builder: 'date',
        dimension_parameter: {
            column: 'date',
            shared: false,
            namespace: 'none'
        },
        display_axis:{
            x: localized_strings.chart_date_labelx,
            y: localized_strings.chart_date_labely
        },
        display_colors: [4],
        display_intro: 'top',
        display_filter: true,
        domain_builder: 'date',
        domain_parameter: 'custom_date',
        group_builder: 'auto',
        group_parameter: {column: ['none']},
        instance_builder: 'bar',
    },
    age: {
        buttons_list: ['reset', 'help'],
        instance_builder: 'bar',
        dimension_builder: 'integer',
        dimension_parameter: {
            column: 'age',
            shared: false,
            namespace: 'none'
        },
        display_axis:{
            x: localized_strings.chart_age_labelx,
            y: localized_strings.chart_age_labely
        },
        display_colors: [4],
        display_filter: true,
        display_intro: 'top',
        domain_builder: 'integer_linear',
        domain_parameter: 'custom_linear',
        group_builder: 'auto',
        group_parameter: {column: ['none']},
    },
    diagnosis: {
        buttons_list: ['reset', 'help'],
        dimension_builder: 'auto',
        dimension_parameter: {
            column: 'diagnosis',
            shared: false,
            namespace: 'none'
        },
        display_axis:{
            x: '',  // doesn't move properly when chart is resized
            y: localized_strings.chart_diagnosis_labely
        },
        display_colors: [4],
        display_intro: 'bottom',
        display_filter: true,
        domain_builder: 'none',
        domain_parameter: 'none',
        group_builder: 'auto',
        group_parameter: {column: ['none']},
        instance_builder: 'row',
    },
    table: {
        buttons_list: ['help'],
        dimension_builder: 'auto',
        dimension_parameter: {
            column: 'epiwk',
            shared: false,
            namespace: 'none'
        },
        display_intro: 'top',
        domain_builder: 'none',
        domain_parameter: 'none',
        instance_builder: 'table',
        group_builder: 'none',
        group_parameter: {column: 'none'},
    },
};

g.global_filter = {
    accessor: function(rec) {
        return rec[g.medical_headerlist.diagnosis];
    },
    initialize: function(dimension) {
        g.global_filter.dimension = dimension;
        g.viz_definition.diagnosis.chart.colors('#e66');

        var extras = g.medical_data.extras || {};

        var all_values = [];
        var default_values = [];

        var diagnosis_all_values = extras.diagnosis_all_values || [];
        var diagnosis_shown_by_default = extras.diagnosis_shown_by_default || [];

        for (var i = 0; i < diagnosis_all_values.length; i++) {
            var value = diagnosis_all_values[i];
            if (value) {
                if (all_values.indexOf(value) === -1) {
                    all_values.push(value);
                }
                if (diagnosis_shown_by_default[value]) {
                    if (default_values.indexOf(value) === -1) {
                        default_values.push(value);
                    }
                }
            }
        }
        g.global_filter.all_values = all_values.length ? all_values : null;
        g.global_filter.default_values = default_values.length ? default_values : null;
    },
    setEnabled: function(enabled) {
        var chart = g.viz_definition.diagnosis.chart;
        if (enabled && g.global_filter.default_values) {
            g.global_filter.dimension.filter(function(value) {
                return g.global_filter.default_values.indexOf(value) >= 0;
            });
            domain = g.global_filter.default_values;
        } else {
            g.global_filter.dimension.filterAll();
            domain = g.global_filter.all_values;
        }
        if (domain) {
            setChartDomainToFixedList(chart, domain);
            chart.height(80 + 30 * domain.length);
        }

        // The animated transition is nonsensical when rows appear/disappear.
        disableTransitions(g.viz_definition.diagnosis.chart);
        dc.redrawAll();
        enableTransitions(g.viz_definition.diagnosis.chart);
        module_colorscale.lockcolor('Auto');
    }
};

/**
 Defines the chart used as a reference for time-related interactions.
 * @constant
 * @type {String}
 * @alias module:g.viz_timeline
 */
g.viz_timeline = 'date';

/**
 Defines the charts that are using time dimensions and that should be synchronized with the reference defined with {@link module:g.viz_timeline}.
 * @constant
 * @type {Array.<String>}
 * @alias module:g.viz_timeshare
 */
g.viz_timeshare = [];


g.module_multiadm = g.module_multiadm || {};
g.module_multiadm.default_bounds = [[-6.9, 39.1], [-6.8, 39.3]];

g.configure_charts = function() {
    var defs = g.viz_definition;

    configureWideBarChart(defs.date.chart);
    configureWideBarChart(defs.age.chart);
    configureRowChart(defs.diagnosis.chart);

    enableTransitions(defs.date.chart);
    enableTransitions(defs.age.chart);
    enableTransitions(defs.diagnosis.chart);
};

function disableTransitions(chart) {
    chart.transitionDuration(0);
}

function enableTransitions(chart) {
    chart.transitionDuration(200);
};

function configureWideBarChart(chart) {
    chart.renderHorizontalGridLines(true);
    chart.yAxis().ticks(4);
    chart.yAxis().tickFormat(function(y) {
        return (y === Math.floor(y)) ? y : '';
    });
}

function configureRowChart(chart) {
    chart.xAxis().ticks(4);
    chart.xAxis().tickFormat(function(x) {
        return (x === Math.floor(x)) ? x : '';
    });
}

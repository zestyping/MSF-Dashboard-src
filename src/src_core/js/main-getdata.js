/*------------------------------------------------------------------------------------
    MSF Dashboard - main-getdata.js
    (c) 2015-present, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This file is the current implementation of the getdata module.
 * @since 0.8
 * @module main_loadfiles
 * @requires index.html
 * @requires user/user-defined.js
 * @todo Polish it all.
 **/
module_getdata = {};
/*------------------------------------------------------------------------------------
    Components:
    0)
------------------------------------------------------------------------------------*/

console.log(g);

// 1) Show loading Screen
//------------------------------------------------------------------------------------
$('#modal').modal({
    backdrop: 'static',
    keyboard: false
});

$('#modal').modal('show');

module_getdata.read_config = function(getdata) {
    getdata.datatypes = Object.keys(getdata);
    getdata.datasources = {};
    getdata.datatypes.forEach(function(datatype) {
        getdata.datasources[datatype] = Object.keys(getdata[datatype]);
    });
};

module_getdata.load_initiate = function(exceptions) {
    g.module_getdata.exceptions = exceptions;
    // [x,y] where x data types, y source list
    g.module_getdata.count = [0,-1];
    module_getdata.load_propagate();
};

module_getdata.load_propagate = function(){
    var getdata = g.module_getdata;
    g.module_getdata.count[1]++;
    var count = g.module_getdata.count;

    if(count[1] >= getdata.datasources[getdata.datatypes[count[0]]].length && (count[0] >= getdata.datatypes.length - 1)){
        console.log('main-getdata.js: Your last source has been read.');
        generate_display();

    }else{

      var current_datatype = getdata.datatypes[count[0]];
      var current_dataname = getdata.datasources[current_datatype][count[1]];

      if(count[1] >= getdata.datasources[current_datatype].length){
          count[0] = count[0] + 1;
          count[1] = 0;
          var current_datatype = getdata.datatypes[count[0]];
          var current_dataname = getdata.datasources[current_datatype][count[1]];
      }


      // Manage exceptions
      if(getdata.exceptions){
          if(getdata.exceptions[0] == 'not'){
              if(getdata.exceptions[1] == current_dataname){
                  count[0]++;
              }
          }else if(getdata.exceptions[0] == 'only'){
              if(getdata.exceptions[1] !== current_dataname){
                  count[0]++;
              }
          }
      }
      console.log('main-getdata.js: Current: ' + current_datatype + ' - ' + current_dataname);
      var current_datasource = getdata[current_datatype][current_dataname];
      switch(current_datasource.method){
            case 'd3':
                $(load_status).html('Loading local files...');
                var name = '' + current_datatype + '_data';
                if(!g[name]){g[name] = {};}
                module_getdata.load_filed3(current_datasource.options.url,current_datasource.options.type,[name,current_dataname],module_getdata.load_propagate);
                break;
            case 'medicald3server':
                $(load_status).html('Loading local medical files...');
                module_getdata.load_medical_d3server(current_datasource.options.url,current_datasource.options.type);
                break;
            case 'medicalfs':
                $(load_status).html('Loading local medical files...');
                module_getdata.load_medical_fs(current_datasource.options.url,current_datasource.options.type);
                break;
            case 'medicald3noserver':
                $(load_status).html('Loading local medical files...');
                module_getdata.load_medical_d3noserver(current_datasource.options.url,current_datasource.options.type);
                break;
            case 'geometryd3':
                $(load_status).html('Loading local geometry files...');
                var name = '' + current_datatype + '_data';
                if(!g[name]){g[name] = {};}
                module_getdata.load_filed3(current_datasource.options.url,current_datasource.options.type,[name,current_dataname],module_getdata.afterload_geometry_d3);
                break;
            case 'populationgeometry':
                $(load_status).html('Loading population data from geometry...');
                var name = '' + current_datatype + '_data';
                if(!g[name]){g[name] = {};}
                module_getdata.load_population_from_geometry(current_datasource.options.property);
                break;
            case 'populationd3':
                $(load_status).html('Loading local population files...');
                var name = '' + current_datatype + '_data';
                if(!g[name]){g[name] = {};}
                module_getdata.load_filed3(current_datasource.options.url,current_datasource.options.type,[name,current_dataname],module_getdata.afterload_population);
                break;
            case 'medicalxlsx':
                $(load_status).html('Loading local medical files...');
                module_getdata.load_medical_xlsfolders(current_datasource.options.url, current_datasource.options);
                break;
            default:
                console.log('main-getdata.js ~l80: Your method to access  the source is not defined: ' + current_datasource.method);
                module_getdata.load_propagate();
                break;
      }
    }
};

/*--------------------------------------------------------------------
    Data load options: General
--------------------------------------------------------------------*/

// Load a files with d3: 'json', 'tsv', 'csv'
module_getdata.load_filed3 = function(file,filetype,save,exit_fun) {

    filetype = filetype || file.replace(/^.*\./, '');
    if(filetype == 'txt' || filetype == 'TXT'){filetype = 'tsv';}

    d3.queue()
        .defer(d3[filetype], file)
        .await(readfile);

    function readfile(error,data) {
        if(error){console.log(error);}

        if(typeof save == 'string'){
            g[save] = data;
        }else if(save[0] && save[1]){
            g[save[0]][save[1]] = data;
        }
        exit_fun();
    }
};

module_getdata.load_filefs = function(file,filetype,save,exit_fun) {

    filetype = filetype || file.replace(/^.*\./, '');
    var fs = nw.require('fs');

    fs.readFile(file, 'utf-8', function (error, data) {
        if(error){console.log('here',error);}

        data = d3[filetype].parse(data);

        if(typeof save == 'string'){
            g[save] = data;
        }else if(save[0] && save[1]){
            g[save[0]][save[1]] = data;
        }
        exit_fun();
    });
};



/*--------------------------------------------------------------------
    Data load options: Geometry
--------------------------------------------------------------------*/
module_getdata.afterload_geometry_d3 = function() {
    // Check if last geometry
    var getdata = g.module_getdata;
    var count = g.module_getdata.count;
    var current_datatype = getdata.datatypes[count[0]];
    var current_dataname = getdata.datasources[current_datatype][count[1]];
    var last_check = current_dataname == getdata.datasources.geometry[getdata.datasources.geometry.length - 1];

    if(last_check){
        module_getdata.process_geometry();
    }

    module_getdata.load_propagate();
};

// Common
/**
 * Reads the content of {@link module:g.geometry_data} that has just been parsed by the {@link module:main_loadfiles~queue_geometry} function and of {@link module:g.population_data} that has just been parsed by the {@link module:main_loadfiles~queue_population} if available.<br>
 The function returns various files:
 <ul>
    <li> **Related to geometry data**
         <ul>
            <li>{@link module:g.geometry_loclists}</li>
            <li>{@link module:g.geometry_keylist}</li>
            <li>{@link module:g.geometry_levellist}</li>
            <li>{@link module:g.geometry_subnum}</li>
         </ul>
    </li>
    <li> **Related to population data** (if any)
         <ul>
            <li>{@link module:g.population_loclists}</li>
            <li>{@link module:g.population_databyloc}</li>
            <li>{@link module:g.population_keylist}</li>
         </ul>
    </li>
 </ul>
 * @function
 * @alias module:main_loadfiles~read_commons
 **/
module_getdata.process_geometry = function(){
    /**
     * Stores the name of the administrative elements extracted from {@link module:g.geometry_data} by {@link module:main_loadfiles~queue_geometry}. Names are formatted in the following way: <code>'AdmN0', 'AdmN1',...</code> in order to manage efficiently pyramids and possible duplicates at lowest administrative levels.<br>
     Each administrative level is stored in a different Object.
         <br>
     * Processing triggered in {@link module:main_loadfiles~read_commons}.
     * @constant
     * @type {Object.<Array.<String>>}
     * @alias module:g.geometry_loclists
     */
    g.geometry_loclists = {};
    g.geometry_loclists.all = [];
    /**
     * Stores keys of each administrative level extracted from the {@link module:g.module_getdata}.
     <br>
     * Processing triggered in {@link module:main_loadfiles~read_commons}.
     * @constant
     * @type {Array.<String>}
     * @alias module:g.geometry_keylist
     */
    g.geometry_keylist = Object.keys(g.module_getdata.geometry);
    console.log('geometry_keylist', g.geometry_keylist);
    /**
     * Stores a number associate with administrative level (0 is the wider, and the bigger is the lowest/smaller).
         <br>
     * Processing triggered in {@link module:main_loadfiles~read_commons}.
     * @constant
     * @type {{admNX: number}}
     * @alias module:g.geometry_levellist
     */
    g.geometry_levellist = {};
    /**
     * Stores the number of lowest administrative level within a given administrative level (eg. number of AdmN3 in AdmN2, AdmN1 and AdmN0). This is used to compute completeness {@link module:g.medical_completeness} in {@link module:module_datacheck~dataprocessing} > {@link module:module_datacheck~completenessCheck}.
         <br>
     * Processing triggered in {@link module:main_loadfiles~read_commons}.
     * @constant
     * @type {{admNX: number}}
     * @alias module:g.geometry_subnum
     */
    g.geometry_subnum = {};
    g.geometry_features = {};
    g.geometry_keylist.forEach(function(key,keynum){ 
        g.geometry_levellist[key] = keynum;     
        g.geometry_loclists[key] = [];
        g.geometry_features[key] = {};
        g.geometry_data[key].features.forEach(function(f){  
            var name = f.properties.name || '';
            if (g.geometry_level_properties && g.geometry_level_properties.length > 0) {
                var name_parts = [];
                for (var i = 0; i <= keynum; i++) {
                    name_parts[i] = (f.properties[g.geometry_level_properties[i]] || '').trim();
                }
                name = name_parts.join(', ');
                f.properties.name = name;
            }

            g.geometry_features[key][name] = f;
            g.geometry_loclists[key].push(name);    //add it into the geometry_loclists
            g.geometry_loclists.all.push(name);

            // Compute number of Sub-Areas in Area
            if (g.new_layout) {

                if (!(module_multiadm.hasChildren(key))) {       //if it is lowest geometry - i.e. if it has no children
                    g.geometry_subnum[name] = 1 ;   //has 1 subarea/itself
                    var temp_key = module_multiadm.getParent(key);
                    var temp_loc = '';
                    while (temp_key != '') {
                        temp_loc += ', ' + name.split(', ')[g.geometry_levellist[temp_key]].split('_').join(' ');  //add parent name to beginning
                        g.geometry_subnum[temp_loc.substring(2, temp_loc.length)]++;    //add to g.geometry_subnum
                        temp_key = module_multiadm.getParent(temp_key);                 //get next parent up
                    }

                } else {      //if it is not lowest geometry
                    if (!(g.geometry_subnum[name])) {       
                        g.geometry_subnum[name] = 0 ;
                    }
                }

            } else {    

                if (keynum == g.geometry_keylist.length - 1) {        //if it is lowest geometry
                    g.geometry_subnum[name] = 1 ;       //full geometry name = 1 subarea/itself (e.g. temp_loc=admN1,admN2,admN3)
                    var temp_loc = '';
                    for (var i=0; i<=g.geometry_keylist.length-2; i++) {       //for each higher adm level
                       for (var j=0; j<=i; j++) {
                            temp_loc += ', ' + name.split(', ')[j].split('_').join(' ');   //recreate geometry name(e.g. for admN2 name is admN1, admN2)
                        }
                        temp_loc = temp_loc.substring(2, temp_loc.length);
                        g.geometry_subnum[temp_loc]++;
                    }

                } else {      //if it is not lowest geometry
                    g.geometry_subnum[name] = 0 ;
                }

            }
        });
    });
};

/*--------------------------------------------------------------------
    Data load options: Population
--------------------------------------------------------------------*/

module_getdata.load_population_from_geometry = function(prop) {
    var popbyloc = {};
    g.module_population.population_loclists = {};
    g.module_population.population_databyloc = {pop: popbyloc};
    g.module_population.population_keylist = Object.keys(g.module_getdata.population);

    g.geometry_keylist.forEach(function(key) {
        var unknowns = [];
        var total = 0;
        var count = 0;
        for (var loc in g.geometry_features[key]) {
            var feature = g.geometry_features[key][loc];
            var pop = feature.properties[prop];
            if (pop) {
                popbyloc[loc] = pop;
                total += pop;
                count += 1;
            } else {
                unknowns.push(loc);
            }
        }
        if (count > 0) {
            // Crudely fill in any unknown population values with the
            // average population of all other divisions at the same level.
            unknowns.forEach(function(loc) {
                popbyloc[loc] = total / count;
            });
        }
    });

    module_getdata.load_propagate();
};

module_getdata.afterload_population = function(data) {
    module_getdata.process_population();
    module_getdata.load_propagate();
};

module_getdata.process_population = function(){
    /**
     * Stores the name of the administrative elements extracted from {@link module:g.population_data}. Names should already be formatted in the following way: <code>'AdmN0', 'AdmN1',...</code> in the source file in order to manage efficiently pyramids and possible duplicates at lowest administrative levels.<br>
     Each administrative level is stored in a different Object.
         <br>
     * Processing triggered in {@link module:main_loadfiles~read_commons}.
     * @constant
     * @type {Object.<Array.<String>>}
     * @alias module:g.population_loclists
     */
    g.module_population.population_loclists = {};
    /**
     * Restores population figures from {@link module:g.population_data} in order that each administrative level is stored in a different Object.
         <br>
     * Processing triggered in {@link module:main_loadfiles~read_commons}.
     * @constant
     * @type {Object.<Array.<String>>}
     * @alias module:g.population_databyloc
     */
    g.module_population.population_databyloc = {};      //Object to account for new population data format of multiple years of pop defined

    /**
     * Stores keys of each administrative level extracted from the {@link module:g.module_getdata.population}.
         <br>
     * Processing triggered in {@link module:main_loadfiles~read_commons}.
     * @constant
     * @type {Object.<Array.<String>>}
     * @alias module:g.population_keylist
     */
    g.module_population.population_keylist = Object.keys(g.module_getdata.population);
    if (g.module_population.pop_new_format) {                               //Note: hardcoding of admNx here
        //Accounting for new population data format 
        g.module_population.population_keylist.forEach(function(key){
            g.module_population.population_loclists[key] = [];
            g.module_population.population_databyloc[key] = {};
            g.population_data[key].forEach(function(f){
                g.module_population.population_loclists[key].push(f[g.module_population.pop_headerlist.admNx.trim()]);
                temp={};
                for (pop_yr in g.module_population.pop_headerlist.pop) {
                    temp[pop_yr] = parseInt(f[pop_yr]);
                };
                g.module_population.population_databyloc[key][f[g.module_population.pop_headerlist.admNx.trim()]] = temp;
            });            
        });
    } else {        
        g.module_population.population_keylist.forEach(function(key){
            g.module_population.population_loclists[key] = [];
            g.module_population.population_databyloc[key] = {};
            g.population_data[key].forEach(function(f){
                g.module_population.population_loclists[key].push(f[g.population_headerlist.admNx.trim()]);
                g.module_population.population_databyloc[key][f[g.population_headerlist.admNx.trim()]] = parseInt(f[g.population_headerlist.pop]);
            
            });
        });
    }
    
};

/*--------------------------------------------------------------------
    Data load options: Medical
--------------------------------------------------------------------*/

module_getdata.load_medical_xlsfolders = function(path, options) {

    var fs = nw.require('fs');

    /**
     * Gets the medical data folder path.
     * @constant
     * @type {String}
     * @alias module:g.medical_folder
     */
    g.medical_folder = path;

    /**
     * Lists the medical data files in the {@link module:g.medical_folder} folder path (uses Node server-side capability).
     * @constant
     * @type {Array.<String>}
     * @alias module:g.medical_filelist_raw
     */
    g.medical_filelist_raw = fs.readdirSync('.'+g.medical_folder);

    /**
     * Stores the name of the files currently being read. Starts with just the first file in the {@link module:g.medical_filelist} and then {@link module:main_loadfiles~generate_display} gives the user the option to choose any subset of all the available files.
     * @type {Array.<String>}
     * @alias module:g.medical_files
     */
    g.medical_files = [];

    /**
     * Lists files in the datafolder that matches the extension criteria (currently *.txt | *.TXT | *.csv | *.CSV) in the {@link module:g.medical_filelist_raw}.
     * @constant
     * @type {Array.<String>}
     * @alias module:g.medical_filelist
     **/
    g.medical_filelist = [];

    // Check file format (currently only .text / tabulation separated values - tsv)
    g.medical_filelist_raw.forEach(function(f){
        var ext = f.replace(/^.*\./, '');
        if (!f.startsWith('~') && ext.toLowerCase() === 'xlsx') {
            g.medical_filelist.push(f);
        }
    });

    // Initialise with first medical file in the list
    g.medical_files = [g.medical_filelist[0]];

    module_getdata.load_medical_xls(options);
}

module_getdata.load_medical_xls = function(options) {
    var medical_data = [];
    var extras = {};
    var specs = (options || {}).extras || [];

    g.medical_files.forEach(function(filename) {
        module_getdata.load_medical_xls_file(
            '.' + g.medical_folder + filename, specs, medical_data, extras);
    });

    /* Save results and continue with data loading */
    medical_data.extras = extras;
    g.medical_data = medical_data;
    module_getdata.afterload_medical_d3(medical_data);
};

module_getdata.load_medical_xls_file = function(path, specs, medical_data, extras) {
    console.log('start reading from ' + path);
    var fs = nw.require('fs');
    var data = fs.readFileSync(path, 'binary');

    /* Call XLSX */
    var workbook = XLSX.read(data, {type: 'binary'});
    var input = workbook.Sheets['input'] || workbook.Sheets[workbook.SheetNames[0]];
    var lastCell = XLSX.utils.decode_range(input['!ref']).e; // .e for "end"
    var toAddr = XLSX.utils.encode_cell;
    var fromAddr = XLSX.utils.decode_cell;

    /* Get header row */
    var colIndexes = {};
    var colFixers = {};
    for (var c = 0; c <= lastCell.c; c++) {
        var header = (input[toAddr({c: c, r: 0})] || {}).v;
        for (var key in g.medical_headerlist) {
            if (normalize(header) == normalize(g.medical_headerlist[key])) {
                colIndexes[key] = c;
                colFixers[c] = (g.medical_data_fixers || {})[key];
            }
        }
    }
    console.log('column headers found in ' + name + ':', colIndexes);

    var filter = g.medical_data_filter || (function () { return true; });

    /* Get data rows */
    for (var r = 1; r <= lastCell.r; r++) {
        var dataRow = [];
        var populatedCells = 0;

        for (var c = 0; c <= lastCell.c; c++) {
            var value = (input[toAddr({c: c, r: r})] || {}).v || '';
            populatedCells += (value !== '');
            var fixer = colFixers[c];
            dataRow.push(fixer ? fixer(value) : value);
        }

        if (populatedCells > 0) {
            record = {};
            for (var key in g.medical_headerlist) {
                record[g.medical_headerlist[key]] = dataRow[colIndexes[key]];
            }
            if (filter(record)) {
                console.log('record ' + medical_data.length + ':', record);
                medical_data.push(record);
            }
        }
    };
    console.log('finished loading records from ' + path);

    /* Get extra data */
    for (var i = 0; i < specs.length; i++) {
        module_getdata.read_extra_from_workbook(extras, workbook, specs[i]);
    }
};

module_getdata.read_extra_from_workbook = function(extras, workbook, spec) {
    var sheet = workbook.Sheets[spec.sheet];

    if (spec.key_range && spec.value_range) {
        if (!(spec.name in extras)) extras[spec.name] = {};
        var keyAddrs = addrsInRange(spec.key_range);
        var valueAddrs = addrsInRange(spec.value_range);
        for (var i = 0; i < keyAddrs.length && i < valueAddrs.length; i++) {
            var key = (sheet[keyAddrs[i]] || {}).v || '';
            var value = (sheet[valueAddrs[i]] || {}).v || '';
            if (key !== '' && value !== '') {
                extras[spec.name][key] = value;
            }
        }
    }

    if (spec.item_range) {
        if (!(spec.name in extras)) extras[spec.name] = [];
        var addrs = addrsInRange(spec.item_range);
        for (var i = 0; i < addrs.length; i++) {
            extras[spec.name].push((sheet[addrs[i]] || {}).v || '');
        }
    }
};

// d3.js (local file)

module_getdata.reload_medical = function() {
    if (g.module_getdata.medical.medical.method == 'medicalxlsx') {
        module_getdata.load_medical_xls(g.module_getdata.medical.medical.options);
    }else if(g.module_getdata.medical.medical.method == 'medicald3server'){
        module_getdata.load_filed3(g.medical_folder + g.medical_files[0], null, 'medical_data', module_getdata.afterload_medical_d3);
    }else if(g.module_getdata.medical.medical.method == 'medicalfs'){
        module_getdata.load_filefs('.' + g.medical_folder + g.medical_files[0], null, 'medical_data', module_getdata.afterload_medical_d3);
    }else{
        console.log('main-getdata.js ~l475: The medical data parsing method does not currently allow selecting from folder.');;
    }
};

module_getdata.load_medical_d3noserver = function(files, ftype) {
    if(typeof files == 'string'){
      var filepath = files.split('/');
      var filename = filepath.pop();
      filepath = filepath.join('/')+'/';
      console.log(filename);
      console.log(filepath);
      g.medical_folder = filepath;
      g.medical_filelist_raw = [filename];
    }
    module_getdata.load_medical_d3(ftype);
};

// TODO(ping): THIS FUNCTION IS BROKEN
module_getdata.load_medical_fs = function(path, ftype) {
    var fs = nw.require('fs');

    /**
     * Gets the medical data folder path.
     * @constant
     * @type {String}
     * @alias module:g.medical_folder
     */
    g.medical_folder = path;

    /**
     * Lists the medical data files in the {@link module:g.medical_folder} folder path (uses Node server-side capability).
     * @constant
     * @type {Array.<String>}
     * @alias module:g.medical_filelist_raw
     */
    g.medical_filelist_raw = fs.readdirSync('.'+g.medical_folder);

    /**
     * Stores the name of the file currently being read. Starts with the first file in the {@link module:g.medical_filelist} and then {@link module:main_loadfiles~generate_display} gives the user the option to choose between all the available files.
     * @constant
     * @type {String}
     * @alias module:g.medical_files
     */
    g.medical_files = [];

    /**
     * Lists files in the datafolder that matches the extension criteria (currently *.txt | *.TXT | *.csv | *.CSV) in the {@link module:g.medical_filelist_raw}.
     * @constant
     * @type {Array.<String>}
     * @alias module:g.medical_filelist
     **/
    g.medical_filelist = [];

    // Check file format (currently only .text / tabulation separated values - tsv)
    g.medical_filelist_raw.forEach(function(f){
        if(ftype == 'csv'){
            var cond = f.substr(f.length - 4)=='.csv' || f.substr(f.length - 4)=='.CSV';
        }else if(ftype == 'tsv'){
            var cond = f.substr(f.length - 4)=='.txt' || f.substr(f.length - 4)=='.TXT' || f.substr(f.length - 4)=='.tsv' || f.substr(f.length - 4)=='.TSV' ;
        }else{
            console.log('main-getdata.js ~l410: Your the type of your source files is not recognized: ' + type)
        }
        if(cond){
            g.medical_filelist.push(f);
        }
    });

    // Initialise with first medical file in the list
    g.medical_files = [g.medical_filelist[0]];

    module_getdata.load_filefs('.' + g.medical_folder + g.medical_files[0], ftype,'medical_data',module_getdata.afterload_medical_d3);

}

module_getdata.load_medical_d3 = function(ftype) {

    /**
     * Lists files in the datafolder that matches the extension criteria (currently *.txt | *.TXT | *.csv | *.CSV) in the {@link module:g.medical_filelist_raw}.
     * @constant
     * @type {Array.<String>}
     * @alias module:g.medical_filelist
     **/
    g.medical_filelist = [];

    // Check file format (currently only .text / tabulation separated values - tsv)
    g.medical_filelist_raw.forEach(function(f){
        if(ftype == 'csv'){
            var cond = f.substr(f.length - 4)=='.csv' || f.substr(f.length - 4)=='.CSV';
        }else if(ftype == 'tsv'){
            var cond = f.substr(f.length - 4)=='.txt' || f.substr(f.length - 4)=='.TXT' || f.substr(f.length - 4)=='.tsv' || f.substr(f.length - 4)=='.TSV' ;
        }else{
            console.log('main-getdata.js ~l410: Your the type of your source files is not recognized: ' + type)
        }
        if(cond){
            g.medical_filelist.push(f);
        }
    });

    // Initialise with first medical file in the list
    g.medical_files = [g.medical_filelist[0]];

    module_getdata.load_filed3(g.medical_folder + g.medical_files[0], null, 'medical_data', module_getdata.afterload_medical_d3);
};

module_getdata.afterload_medical_d3 = function(data) {

  /**
   * Lists from {@link module:g.medical_headerlist} the keys used to refer to specific {@link module:g.medical_data} fields. Defined in the Dashboard (might be different from the headers in the data files) in {@link user-defined} {@link module:g.medical_headerlist}.
   * @constant
   * @type {Array.<String>}
   * @alias module:g.medical_keylist
   */
  g.medical_keylist = Object.keys(g.medical_headerlist);

  console.log('main-getdata.js ~l630: Medical files selected: ' + g.medical_files);


  // Load Optional Module: module-datacheck.js
  module_datacheck.dataprocessing();
  module_getdata.load_propagate();
};

// KoBo

module_getdata.generate_loginscreen = function(what,exit_fun) {
    var html = '<section class="container">';
    html+= '<div>';
    html+= '  <h2>Login to '+ what +'</h2>';
    html+= '    <p><input type="text" id="login" value="" placeholder="Username"></p>';
    html+= '    <p><input type="password" id="password" value="" placeholder="Password"></p>';
    html+= '    <p class="submit"><input type="submit" name="commit" value="Login"></p>';
    html+= '</div>';

    html+= '<div class="login-help">';
    html+= '  <p> <small>Forgot your password?<br><a href="">Contact the Administrator</a></small></p>';
    html+= '</div>';
    html+= '</section>';
    $('.modal-content').html(html);

    $('.submit').on('click',function(){
        var login = $('#login').val();
        var password = $('#password').val();
        exit_fun(login,password);
        modal_loading();
    });
};

module_getdata.read_config(g.module_getdata);
module_getdata.load_initiate();
//module_getdata.load_initiate(g.module_getdata,['only','medical']);


/**
 * Takes a string and returns the same string with title case (first letter of each word is capitalized). Used to normalize strings such as administrative division names or disease names.
 * @type {Function}
 * @param {String} str
 * @returns {String}
 * @alias module:module_datacheck~toTitleCase
 */
function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function normalize(name) {
    // When matching header names, ignore capitalization, spaces,
    // and parenthesized parts.
    return (name || '').replace(
        /\(.*?\)/g, ' ').replace(/ +/g, ' ').trim().toLowerCase();
}

function addrsInRange(range) {
    var range = XLSX.utils.decode_range(range);
    var start = range.s;
    var end = range.e;
    var addrs = []
    for (var r = start.r; r <= end.r; r++) {
        for (var c = start.c; c <= end.c; c++) {
            addrs.push(XLSX.utils.encode_cell({c: c, r: r}));
        }
    }
    return addrs;
}

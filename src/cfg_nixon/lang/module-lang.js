/*------------------------------------------------------------------------------------
    MSF Dashboard - module-lang.js
    (c) 2015-2016, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
 /**
 * This file implements the lang module. It stores all the texts that are visible to the end user in all the available languages (by default French, English and Castilian). 
 <br>
 This requires developer adaptation for each new dashboard.
 * @since 1.0
 * @module module:module_lang
 * @requires index.html
 **/
var module_lang = {}
/*------------------------------------------------------------------------------------
	Components:
	0) Setup
	1) French
	2) English
	3) Spanish - to be implemented
------------------------------------------------------------------------------------*/

// 0) Setup
//------------------------------------------------------------------------------------

modules_list.lang = true;

/**
 * Stores all the global variables used by the {@link module:module_lang}. To simplify, variables in the 'sub-module' domain will only appear there.
 * @type {Object} 
 * @alias module:g.module_lang
 */
g.module_lang = {};

/**
 * Stores the current language selected for the dashboard, <code>fra</code> by default.
 	 <br>
 * {@link module:g.module-lang~module_lang_display} enables the dashboard user to switch between availanle languages stored in {@link module:module-lang.list}.
 * @type {String} 
 * @alias module:module_lang.current
 */
g.module_lang.current = 'eng';

/**
 * Stores the list of available languages in the dashboard: both key and complete name.
 * @type {Object} 
 * @alias module:module_lang.list
 */
g.module_lang.list = {
	'eng':'English',
	//'cas':'Castilian'
	};

/**
 * Stores the list of keys related to the available languages taken from {@link module:module-lang.list}.
 * @type {Object} 
 * @alias module:module_lang.keylist
 */
g.module_lang.keylist = Object.keys(g.module_lang.list);

/**
 * Stores all the texts that are visible to the end user in all the available languages. Texts corresponding to a each specific language are stored in specific objects which access key is the same as in {@link module:module-lang.list}.
 * @type {Object.<Object>} 
 * @alias module:module_lang.text
 */
g.module_lang.text = {};

/**
 * Generates the language switch buttons in all available languages using:
 <br>
 <ul>
 	<li>{@link module:module_lang.list} for the texts,</li>
 	<li>{@link module:module_lang.current} to treat differently the currently selected language,</li>
 	<li>{@link module:module_lang.keylist} to loop over the language list.</li>
 </ul>
 <br>
 Triggered by {@link module:main_loadfiles~generate_display} and triggers {@link module:main_loadfiles~generate_display} if current language is changed by the user.
 * @type {Function} 
 * @alias module:module_lang.display
 */
module_lang.display = function() {
	
	var html = '<span>'+ g.module_lang.list[g.module_lang.current]+'</a> ';

	g.module_lang.keylist.forEach(function(lang){
		if(!(lang == g.module_lang.current)){
			html += '| <a id="lang_'+lang+'" class="link">'+g.module_lang.list[lang]+'</a> ';
		}
	});
	$('#langselect').html(html);

	g.module_lang.keylist.forEach(function(lang){
		if(!(lang == g.module_lang.current)){
			$('#lang_'+lang).on('click',function(){
			 	g.module_lang.current = lang;
				generate_display();
			});
		}
	});
}

//--------------------------------------------------------------------------
// Outbreak
//--------------------------------------------------------------------------

g.module_lang.text.eng = {
	main_title: 'MSF Dashboard \u00b7 Nixon Memorial Hospital v1.2',
	main_description: 'For feedback or questions, please contact the MSF UK Manson Unit at <a href="mailto:gis.mansonunit@london.msf.org">gis.mansonunit@london.msf.org</a>.',

	loadfiles_choose: 'Choose data files to load',
	loadfiles_selected: ['The file currently selected contains','records.'],
	loadfiles_load: 'Open the Dashboard',

	chart_date_title: 'Date',
	chart_date_labelx: '',
	chart_date_labely: 'Cases',
	chart_epiwk_title: 'Epidemiological Week',
	chart_epiwk_labelx: 'Epi Week',
	chart_epiwk_labely: 'Cases',
	chart_sexpreg_title: 'Sex - Pregnancy',
	chart_sexpreg_label12: 'Male',
	chart_sexpreg_label22: 'Female, non Preg.',
	chart_sexpreg_label21: 'Female, Preg.',
	chart_sev_title: 'Dehydration',
	chart_sev_labelA: 'Light',
	chart_sev_labelB: 'Moderate',
	chart_sev_labelC: 'Severe', 
	chart_dur_title: 'Stay Duration',
	chart_dur_labelx: 'Stay Duration',
	chart_dur_labely: 'Cases',
	chart_age_title: 'Age',
	chart_age_labelx: '',
	chart_age_labely: 'Cases',
	chart_out_title: 'Outcome',
	chart_out_labelx: 'Outcome',
	chart_out_label1: 'Cured', 
	chart_out_label2: 'Death',
	chart_out_label3: 'Int. F/U',
	chart_out_label4: 'Transf.',
	chart_out_labely: 'Cases',

	chart_diagnosis_title: 'Diagnoses',
	chart_diagnosis_labelx: 'Cases',
	chart_diagnosis_labely: 'Diagnosis',
	chart_disease_title: 'Diseases',
	chart_disease_labelx: 'Times Reported',
	chart_disease_labely: 'Diseases',
	chart_case_bar_title: 'Cases & Deaths',
	chart_case_lin_title: 'Cases & Deaths',
	chart_case_labelx: 'Epi-Week',
	chart_case_labely: 'Cases',
	chart_death_labelx: 'Epi-Week',
	chart_death_labely: 'Deaths',
	chart_year_title: 'Years',
	chart_fyo_title: 'Age Classes',
	chart_fyo_labelu: 'Under 5',
	chart_fyo_labelo: 'Over 5',

	filtext: 'Current filter:',
	
	map_title: 'Map',
	map_legendNA: '0',
	map_legendEmpty: 'No records',
	map_hover: 'Hover to display',
	map_unit: {
		Cases: 'Number of Cases',
		IncidenceProp: 'Incidence Rate (/10,000 people)',
		Deaths: 'Number of Deaths',
		MortalityProp: 'Mortality Rate (/10,000 people)',
		Completeness: 'Frequency structures report, in %'
	},
	jumpto: 'Goto...',
	map_admN0: {
		title: 'Chiefdoms'
	},
	map_admN1: {
		title: 'Sections'
	},
	map_admN2: {
		title: 'Villages'
	},/* 
	map_admN3: {
		title: 'Cellule'
	}, */
	
	colorscale_title: 'MAP PARAMETERS',
	colorscale_unitintro: 'Choose map unit: ',
	colorscale_modeintro: 'Colorscale values: ',
	colorscale_modeauto: 'Automated',
	colorscale_modepresets: 'Presets',
	colorscale_modemanual: 'Manual',
	colorscale_howto: '',
	colorscale_choosetype: 'Calculation mode: ',
	colorscale_choosecolor: 'Scale type: ',

	datacheck_title: 'QUICK DATA CHECK',
	datacheck_intro: 'Here is a short <b>summary of missing or erroneous data</b>.<br>This might give an indication on whether further efforts should be put in data cleaning or not. Consult the errors log for more details.',
	datacheck_header: 'Header',
	datacheck_error: 'Error',
	datacheck_empty: 'Empty',

	datacheck_more: 'Show error log...',
	datacheck_less: 'Hide error log...',

	datacheck_emptmore: 'Show \'isempty\' errors',
	datacheck_emptless: 'Hide \'isempty\' errors',

	datacheck_copy: 'Copy to clipboard',

	datatable_more: 'Show records table...',
	datatable_less: 'Hide records table...',
	datatable_text: {
        button: 'Copy to clipboard',
        language: {
		    "sProcessing":     "Processing...",
		    "sSearch":         "Search:",
		    "sLengthMenu":     "Show _MENU_ entries",
		    "sInfo":           "Showing _START_ to _END_ of _TOTAL_ entries",
		    "sInfoEmpty":      "Showing 0 to 0 of 0 entries",
		    "sInfoFiltered":   "(filtered from _MAX_ total entries)",
		    "sInfoPostFix":    "",
		    "sInfoThousands":  ",",
		    "sLoadingRecords": "Loading...",
		    "sZeroRecords":    "No matching records found",
		    "sEmptyTable":     "No data available in table",
		    "oPaginate": {
		        "sFirst":    "First",
		        "sLast":     "Last",
		        "sNext":     "Next",
		        "sPrevious": "Previous"
		    },
		    "oAria": {
		        "sSortAscending":  ": activate to sort column ascending",
		        "sSortDescending": ": activate to sort column descending"
		    }
		},
    },
	datatable_legend: '',
	interface_menutitle: 'MENU',
	interface_menuepiwk: 'Quickly filter the \'n\' last weeks',
	interface_menureset: 'Reset all filters',
	interface_menureload: 'Reload',
	interface_menuhelp: 'Help',
	interface_menuautoplay: {
    		play: 'Play',
    		pause: 'Pause'
	},
	interface_menucount: ['out of','records selected','Key figures:', 'Cases:','Deaths:'],
	
	interface_colorscale: 'Go back to the Dashboard',

	intro_intro: '<p>Elements are the features of the dashboard you can click. You will notice you can interact with different elements by selecting and deselecting.The following are the typical ways in which you can interact with the dashboard elements:</p><p><b>1) Filtering by elements.</b><br>This affects all the other graphs, maps and table.</p><p><b>2) Selecting multiple elements.</b><br>This allows you to combine filters eg. by area on the map and gender.</p><p><b>3) Deselecting elements and remove filters.</b><br>Elements can be unfiltered one by one or by using the "Reset filter" button to clear filters applying to one chart. Alternatively, click the "Reset all filters" button on the left side to remove all filters.</p><p><b>4) Hovering over elements to display values.</b><br>Hover the mouse over individual elements to view specific values.</p><p>Click "Next" or press the right-arrow key to learn more about each graph.</p>',

	intro_multiadm:
        '<p>This map displays the number of cases in each section. ' +
        '<p>Click the map to filter data by area. You can select multiple areas. To remove the filter, click the "Reset filter" button above the map. ' +
        '<p>You can zoom directly to specific areas using the "Goto..." drop-down menu.',
	
	intro_epiwk: 'This bar chart displays case numbers by epi-week.<br><i>Click on the bars to filter by a specific epi-week. You can select multiple epi-weeks. To reset, click again on the selected epi-weeks (one by one) or click the "R" button.</i>',

	intro_age: '<p>This bar chart displays case numbers by age.' +
        '<p>Click and drag to filter by an age range. To remove the filter, click the "Reset filter" button above the chart.',

	intro_date: '<p>This bar chart displays case numbers by date.' +
        '<p>Click and drag to filter by a date range. To remove the filter, click the "Reset filter" button above the chart.',

	intro_diagnosis: '<p>This bar chart displays case numbers by diagnosis.' +
        '<p>Click any bar to filter by a specific diagnosis. To remove the filter, click the "Reset filter" button above the chart.' +
        '<p>By default, a partial set of the diagnoses is shown.  To see all the diagnoses, click the "Show all diagnoses" checkbox.',

	intro_sexpreg: 'This pie chart displays case numbers by sex and for women, by pregnancy.<br><i>Click on the pie slices to filter by a specific sex / pregnancy "status". To reset, click the selected pie slices or click the "R" button.</i>',

	intro_sev: 'This pie chart displays case numbers by dehydration state.<br><i>Click on the pie slices to filter by a specific dehydration state. You can select multiple dehydration states. To reset, click the selected pie slices one by one or click the "R" button.</i>',

	intro_dur: 'This bar chart displays case numbers by duration of stay.<br><i>Click on the bars to filter by a specific stay duration. You can select multiple stay durations. To reset, click the selected durations one by one or click the "R" button.</i>',

	intro_out: 'This bar chart displays case numbers by outcome.<br><i>Click on the bars to filter by a specific outcome. You can select multiple outcomes. To reset, click the selected outcomes one by one or click the "R" button.</i>',

	intro_table: 'This table displays the selected records.<br><i>Click on the "Copy to clipboard" button to copy the content of the whole table (in order to export to Excel for instance).</i>',
};

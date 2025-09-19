;( async () => {

	// require("os").platform()
	// require("os").hostname()

	let name = require("os").hostname()

	const transform = require(`C:/Users/${name}/Dropbox/E lab2/a.code/javascript/transform_module_exp`)
	const _ = require(`C:/Users/${name}/AppData/Roaming/npm/node_modules/lodash`)
	const f_server = require(`C:/Users/${name}/Dropbox/E lab2/a.code/javascript/f_server_module_exp`)
	let f_glob = x => glob( x + "**" , { absolute:true, mark:true } )
	const glob = require(`C:/Users/${name}/AppData/Roaming/npm/node_modules/glob`).globSync
	let a = (await walk_folder(`C:/Users/${name}/Downloads/Nouveau dossier (6)/Dropbox/`)).at(0)
	let b = (await walk_folder(`C:/Users/${name}/Dropbox/`)).at(0)

	;( (m) => {
		for( let i=0;i<m.length;i++ )
			m[i].pathx = m[i].pathx.replace(`C:/Users/${name}/Downloads/Nouveau dossier (6)/`,"")
	})(a)

	;( (m) => {
		for( let i=0;i<m.length;i++ )
			m[i].pathx = m[i].pathx.replace(`C:/Users/${name}/`,"")
	})(b)

	// console.log( a.filter( x => x.at(-1) == "\\" ).length )
	// console.log( a.filter( x => x.at(-1) != "\\" ).length )
	// console.log( a.filter( x => x.type == "file" ).length )
	// console.log( a.filter( x => x.type == "folder" ).length )

	let result = _.differenceBy( a,b, "pathx").map( x => x.pathx)
	console.log( result.length )
	f_server( transform( result ) , "html" )

})()

async function walk_folder(dir,level=0){ // file only

	let list = await require("fs").promises.readdir(dir)

	let table = []

	let size = 0

	for ( let filename of list ){

		let pathx = require("path").posix.join(dir,filename)

		let stats = await require("fs").promises.lstat(pathx)

		if( stats.isSymbolicLink() ){
			continue
		}

		if ( stats.isFile() ){

			table.push({ "pathx":pathx, "size":stats.size, "type":"file" })

			size += stats.size

		}else if ( stats.isDirectory() ){

			let [a,b] = await walk_folder(pathx,level+1)
			table.push(...a)
			size += b

		}

	}

	if( level != 0 )
	table.push({ "pathx":dir, "size":size, "type":"folder" })

	return [table,size]

}

let ignore = [
".dropbox.cache",
".dropbox",
"desktop.ini",
]

const escapeRegExp = require("C:/Users/Miguel/Dropbox/E lab2/a.code/javascript/escapeRegExp_module_exp")

let IGNORE_REG = new RegExp( ignore.map( escapeRegExp ).join("|") )

;( async () => {

	// require("os").platform()
	// require("os").hostname()
	// require("os").userInfo().username

	let name = require("os").userInfo().username
	console.log( name )
	// return

	const transform = require(`C:/Users/${name}/Dropbox/E lab2/a.code/javascript/transform_module_exp`)
	const _ = require(`C:/Users/${name}/AppData/Roaming/npm/node_modules/lodash`)
	const f_server = require(`C:/Users/${name}/Dropbox/E lab2/a.code/javascript/f_server_module_exp`)

	// let a = ( await walk_folder(`C:/Users/${name}/Downloads/Nouveau dossier (6)/Dropbox/`) ).at(0)
	// let b = ( await walk_folder(`C:/Users/${name}/Dropbox/`) ).at(0)

	// foo( { a } , `C:/Users/${name}/Downloads/Nouveau dossier (6)/` )
	// foo( { b } , `C:/Users/${name}/` )

	function foo( obj, rp ){

		let [filename,m] = Object.entries(obj).at(0)

		for( let i=0;i<m.length;i++ )
			m[i].pathx = m[i].pathx.replace( rp , "" )

		require("fs").writeFileSync( `${filename}.txt` , JSON.stringify( m,null,2 ) )

	}

	let a = JSON.parse(require("fs").readFileSync("a.txt"))
	let b = JSON.parse(require("fs").readFileSync("b.txt"))

	let result = _.differenceBy( a,b, "hashx" ).map( x => x.pathx )
	console.log( result.length )
	f_server( transform( result ) , "html" )

	// let result = _.differenceBy( a,b, "pathx" ).map( x => x.pathx )
	// console.log( result.length )
	// f_server( transform( result ) , "html" )

})()

function f_hash(x){
	let [algo,format] = ["md5","base64"]
	let hashx = require("crypto").createHash(algo).update(x).digest(format)
	return hashx
}

async function walk_folder( dir, level=0, count={ count:0 } ){

	let list = await require("fs").promises.readdir(dir)

	let table = []

	let size = 0

	for ( let filename of list ){

		let pathx = require("path").posix.join(dir,filename)

		if( (IGNORE_REG).test( pathx ) ) continue

		let stats = await require("fs").promises.lstat(pathx)

		if( stats.isSymbolicLink() ){
			continue
		}

		if ( stats.isFile() ){

			let hashx = ""

			try{
				hashx = f_hash( await require("fs").promises.readFile(pathx) )
			}catch(e){}

			table.push({
				"pathx":pathx,
				"size":stats.size,
				"type":"file",
				"hashx" : hashx,
			})

			count.count++
			console.log( count.count )

			size += stats.size

		}else if ( stats.isDirectory() ){

			let [a,b] = await walk_folder(pathx,level+1,count)
			table.push(...a)
			size += b

		}

	}

	// if( level != 0 )
	table.push({ "pathx":dir, "size":size, "type":"folder" })

	return [table,size]

}

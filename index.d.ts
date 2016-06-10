import { Mongo } from 'meteor/mongo';

declare class FilesCollection extends Mongo.Collection<any> {
	constructor(config?: FilesCollectionConfig)
}

interface FilesCollectionConfig {
	/*
	* Storage path on file system. Relative to running script
	* @default 'assets/app/uploads'
	* */
	storagePath?: string;

	/*
	* Collection name
	* @default 'MeteorUploadFiles'
	* */
	collectionName?: string;

	/*
	* Set Cache-Control header.
	* @default 'public, max-age=31536000, s-maxage=31536000'
	* */
	cacheControl?: string;

	/*
	* Throttle download speed in bps.
	* @default false
	* */
	throttle?: number | boolean;

	/*
	* Server Route used to retrieve files.
	* @default '/cdn/storage'
	* */
	downloadRoute?: string;

	/*
	* Collection Schema.
	* @default '272144'
	* */
	schema?: any;

	/*
	* Function to name files.
	* @default Random.id
	* */
	namingFunction?: () => string;

	/*
	* FS-permissions (access rights) in octal.
	* @default '0644'
	* */
	permissions?: number;

	/*
	* FS-permissions for parent directory (access rights) in octal.
	* @default '0755'
	* */
	parentDirPermissions?: number;

	/*
	* CRC file check.
	* @default true
	* */
	integrityCheck?: boolean;

	/*
	* Strict mode for partial content. If true server will return 416 response code, when range is not specified.
	* @default false
	* */
	strict?: boolean;

	/*
	* Called right before initiating file download.
	* Context:
	* 	this.request
	* 	this.response
	* 	this.user()
	* 	this.userId
	* Return false to abort download, true to continue.
	@default false
	* */
	downloadCallback?: (fileObj: any) => boolean;

	/*
	* Control download flow.
	* Function context:
	* 	this.request - On server only
	* 	this.response - On server only
	* 	this.user()
	* 	this.userId
	* If true - files will be served only to authorized users, if function() - you're able to check visitor's permissions in your own way.
	* Return true to continue, false to abort, or {Number} to abort upload with specific response code, default response code is 401.
	@default false
	* */
	protected?: boolean | {function (fileObj: any): boolean | number};

	/*
	* Allows to place files in public directory of your web-server and let your web-server to serve uploaded files.
	* Collection cannot be public and protected at the same time!
	* downloadRoute must be explicitly provided and pointed to root of web/proxy-server, like /uploads/
	* storagePath must point to absolute root path of web/proxy-server, like '/var/www/myapp/public/uploads/'
	* integrityCheck is not guaranteed!
	* play and force download features is not guaranteed!
	* Remember: NodeJS is not best solution for serving files.
	* @default false
	* */
	public?: boolean;

	/*
	* Callback, triggered right before upload is started on client and right after receiving a chunk on server.
	* Context:
	* 	this.file
	* 	this.user()
	* 	this.userId
	* 	this.chunkId {Number} - On server only
	* 	this.eof {Boolean} - On server only
	* Return true to continue, false to abort, or {String} to abort upload with message
	* note: Because sending meta data as part of every chunk would hit the performance, meta is always empty ({}) except on the first chunk (chunkId=1) and on eof (eof=true).
	* @default false
	* */
	onBeforeUpload?: (fileData: any) => boolean | string;

	/*
	* Callback, triggered right before remove file
	* Context:
	* 	this.file
	* 	this.user()
	* 	this.userId
	* Use with allowClientCode to control access to remove() method.
	* Return true to continue, false to abort.
	* @default false
	* */
	onBeforeRemove?: {function (cursor: Mongo.Cursor<any>): boolean} | boolean;

	/*
	* Callback, triggered after file is written to FS.
	* Alternatively use: addListener('afterUpload', func).
	* @default false
	* */
	onAfterUpload?: (fileRef: any) => any;

	/*
	* Message shown to user when closing browser's window or tab, while upload in the progress.
	* @default 'Upload in a progress... Do you want to abort?'
	* */
	onbeforeunloadMessage?: string | {function (): string};

	/*
	* Allow the use of the remove() method on client?
	* @default true
	* */
	allowClientCode?: boolean;

	/*
	* Turn on debugging and extra logging.
	* @default false
	* */
	debug?: boolean;

	/*
	* Intercept download request.
	* Arguments: http {Object} - Middleware request instance
	* 	http.request {Object} - example: http.request.headers
	* 	http.response {Object} - example: http.response.end()
	* version {String} - Requested file version
	* Usage example: Serve file from third-party resource.
	* Return false from this function to continue standard behavior, true to intercept incoming request.
	* @default false
	* */
	interceptDownload?: (http: any, fileRef: any, version: string) => boolean;
}

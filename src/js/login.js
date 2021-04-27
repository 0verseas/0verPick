(() => {
	/**
	 * private variable
	 */
	const _config = window.getConfig();

	// 引入 reCAPTCHA 的 JS 檔案
    var s = document.createElement('script');
    let src = 'https://www.google.com/recaptcha/api.js?render=' + _config.reCAPTCHA_site_key;
    s.setAttribute('src', src);
    document.body.appendChild(s);

	/**
	 * cache dom
	 */
	const $loginForm = $('.LoginForm');
	const $identifyingCanvas = $('#identifyingCanvas')
	const $identifyingCode = $('#identifyingCode')
	var identifyingCode = '';

	/**
	*	init
	*/

	generateCode();

	/**
	 * bind event
	 */
	$loginForm.on('submit', _handleLogin);
	$identifyingCanvas.on('click',generateCode);

	/**
	 * event handler
	 */
	function _handleLogin(e) {

		//確認驗證碼是否一致  不區分大小寫
		const code = $identifyingCode.val();
		if(code.toUpperCase() !== identifyingCode){
			alert('驗證碼不正確');
			generateCode();
			return;
		}
		generateCode();
		
		const username = $loginForm.find('.LoginForm__input-username').val();
		const password = $loginForm.find('.LoginForm__input-password').val();

		var loginForm = {
			username: username,
			password: sha256(password),
			google_recaptcha_token: ''
		}

		grecaptcha.ready(function() {
            grecaptcha.execute(_config.reCAPTCHA_site_key, {
              action: 'PickLogin'
            }).then(function(token) {
                // token = document.getElementById('btn-login').value
                loginForm.google_recaptcha_token=token;
            }).then(function(){
				window.API.login(loginForm, function (err, data) {
					if (err) {
						// console.error(err);

						if (err.status == 401) {
							alert('帳號或密碼有誤');
						} else if (err.status == 403) {
							alert('Google reCAPTCHA verification failed');
						}
						else if (err.status == 429) {  // 429 Too Many Requests
							alert('錯誤次數太多，請稍後再試。');
						}
						
						return;
					}
		
					const url = window.location.href.split('?url=')[1];
					if (url) {
						window.location.href = url;
					} else {
						window.location.href = './';
					}
				});
			});
        });

		e.preventDefault();
	}

	//產生圖形驗證碼
	function generateCode(){

		//隨機產生數字
		function randomNumber(min, max){
			return Math.floor(Math.random()*(max-min)+min);  //隨機產生一個在min~max之間的整數
		}
	
		//隨機顏色色碼
		function randomColor(min, max){
			
			let r = randomNumber(min, max);
			let g = randomNumber(min, max);
			let b = randomNumber(min, max);
	
			return "rgb("+r+","+g+","+b+")";
		}

		//取得畫布物件屬性
		let canvas = document.getElementById('identifyingCanvas');
		let width = canvas.width;
		let height = canvas.height;
		let context = canvas.getContext('2d');

		//基礎設定 設置文本基線在底部  背景顏色  方形繪製
		context.textBaseline = 'bottom';
		context.fillStyle = randomColor(200,240);
		context.fillRect(0,0,width,height);

		//隨機字母表   去除相似的 1 I   0 O   
		let codeList = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

		let codeString = '';

		//雖機產生4個字母
		for(let i = 0; i<4 ; i++){
			let code = codeList[randomNumber(0,codeList.length)];
			codeString += code;

			context.fillStyle = randomColor(50,160);
			context.font = randomNumber(25,30)+ 'px Arial';  //字體大小25~30隨機

			let x = 10+i*25;
			let y = randomNumber(30,35);  //隨機高度
			let angle = randomNumber(-30,30);  //隨機旋轉角度

			context.translate(x,y);  //移動繪製初始位置
			context.rotate(angle*Math.PI/180);  //旋轉繪製初始位置

			context.fillText(code,0,0);

			context.rotate(-angle*Math.PI/180);  //返回繪製初始位置
			context.translate(-x,-y);  //返回繪製初始位置
		}

		//產生干擾線
		for(let i =0;i<2;i++){
			context.strokeStyle = randomColor(40,180);

			context.beginPath();

			context.moveTo( randomNumber(0,width), randomNumber(0,height));

			context.lineTo( randomNumber(0,width), randomNumber(0,height));

			context.stroke();
		}

		//產生干擾點
		for(let i=0 ; i<50 ; i++){
			context.fillStyle = randomColor(0,255);

			context.beginPath();
			
			context.arc( randomNumber(0,width), randomNumber(0,height),1,0,2*Math.PI);

			context.fill();
		}

		//紀錄驗證碼
		identifyingCode = codeString;
	}
})();

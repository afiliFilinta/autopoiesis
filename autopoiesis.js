var autopoiesis = (function () {

    var camera, scene, controls, renderer;
    var projector, plane;
    var mouse2D, mouse3D, ray, theta = 45,
        isCtrlDown = false;
    var ROLLOVERED;
    var isLock = false;
    var oldColor;
    var objects = [];
    var cubeLength = 40;
    var isStart = false;
    var isPause = false;
    var _iteration = 50;
    var settings = {
        cubeLength: 40,
        iteration: 50,
        interval: 100,
        palette: constants.palette.muzaffer,
        percentage: {
            core: 40,
            block: 60
        }
    }
    var structurePosition = {};
    init();
    animate();


    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function getAxis() {
        var axisValue = getRandomInt(5);
        if (axisValue === 0) {
            return constants.axis.x_pos;
        }
        if (axisValue === 1) {
            return constants.axis.y_pos;
        }
        if (axisValue === 2) {
            return constants.axis.z_pos;
        }
        if (axisValue === 3) {
            return constants.axis.x_neg;
        }
        if (axisValue === 4) {
            return constants.axis.z_neg;
        }
    }

    function getElementType() {
        var elementType = getRandomInt(2);
        var coreCount = settings.iteration * settings.percentage.core / 100;
        if (objects.length >= coreCount) {
            return constants.type.block;
        }
        return elementType;
    }

    function getRandomObject() {
        var index = getRandomInt(objects.length);
        return objects[index];
    }

    function newObject(x, y, z) {
        var obj = {
            point: {
                x,
                y,
                z
            },
            neighbour: {
                x_pos: -1,
                y_pos: -1,
                z_pos: -1,
                x_neg: -1,
                z_neg: -1,
            }
        };
        objects.push(obj);
    }

    function isFull(object, axis) {
        var xStrPoint = object.point.x;
        var yStrPoint = object.point.y;
        var zStrPoint = object.point.z;

        if (axis === constants.axis.x_pos) {
            xStrPoint += cubeLength;
        } else if (axis === constants.axis.y_pos) {
            yStrPoint += cubeLength;
        } else if (axis === constants.axis.z_pos) {
            zStrPoint += cubeLength;
        } else if (axis === constants.axis.x_neg) {
            xStrPoint -= cubeLength;
        } else if (axis === constants.axis.z_neg) {
            zStrPoint -= cubeLength;
        }
        var newStructurepoint = '' + xStrPoint + yStrPoint + zStrPoint;
        if (structurePosition[newStructurepoint] === 1) {
            return true;
        }
        return false;
    }

    function buildStructure() {
        console.log("Cekirdek sayisi: ", objects.length);
        if (isPause) {
            return;
        }

        if (_iteration > 0) {
            var newElemtType = getElementType();
            var axis, object;
            while (true) {
                var axis = getAxis();
                var object = getRandomObject();
                if (object.neighbour[axis] === -1) {
                    if (!isFull(object, axis)) {
                        if (axis === constants.axis.y_pos) {
                            newElemtType = constants.type.core;
                        }
                        object.neighbour[axis] = newElemtType;
                        break;
                    }
                }
            }

            var x = object.point.x;
            var y = object.point.y;
            var z = object.point.z;
            var length = cubeLength;
            var newNeighbour;

            if (axis === constants.axis.x_pos) {
                x += length;
                newNeighbour = constants.axis.x_neg;
            } else if (axis === constants.axis.y_pos) {
                y += cubeLength;
            } else if (axis === constants.axis.z_pos) {
                z += length;
                newNeighbour = constants.axis.z_neg;
            } else if (axis === constants.axis.x_neg) {
                x -= cubeLength;
                newNeighbour = constants.axis.x_pos;
            } else if (axis === constants.axis.z_neg) {
                z -= length;
                newNeighbour = constants.axis.z_pos;
            }

            var material;
            var geometry = new THREE.CubeGeometry(cubeLength, cubeLength, cubeLength);
            if (newElemtType === constants.type.block) {
                for (var i = 0; i < geometry.faces.length; i++) {
                    geometry.faces[i].color.setHex(settings.palette.block);
                }
                material = new THREE.MeshLambertMaterial({
                    vertexColors: THREE.FaceColors
                });

            } else {
                material = new THREE.MeshBasicMaterial({
                    wireframe: true
                });
                material.color = new THREE.Color().setHex(settings.palette.core);
            }

            var voxel = new THREE.Mesh(geometry, material);

            voxel.position.x = x;
            voxel.position.y = y;
            voxel.position.z = z;
            voxel.matrixAutoUpdate = false;
            voxel.updateMatrix();
            scene.add(voxel);

            if (newElemtType === constants.type.core) {
                newObject(x, y, z);
                if (newNeighbour)
                    objects[objects.length - 1].neighbour[newNeighbour] = newElemtType;
            }
            structurePosition['' + x + y + z] = 1;

            _iteration--;
            document.getElementById("iteration").value = _iteration;
            setTimeout(() => {
                buildStructure();
            }, settings.interval);
        } else {
            isStart = false;
            document.getElementById("clean").innerHTML = 'Temizle';
        }
    }

    function init() {

        createSideBar();

        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.y = 800;
        camera.position.x = 1400 * Math.sin(theta * Math.PI / 360);
        camera.position.z = 1400 * Math.cos(theta * Math.PI / 360);

        controls = new THREE.OrbitControls(camera);
        controls.addEventListener('change', render);
        scene = new THREE.Scene();

        addPlane();
        // Lights
        var ambientLight = new THREE.AmbientLight(0x606060);
        scene.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.x = Math.random() - 0.5;
        directionalLight.position.y = Math.random() - 0.5;
        directionalLight.position.z = Math.random() - 0.5;
        directionalLight.position.normalize();
        scene.add(directionalLight);

        var directionalLight = new THREE.DirectionalLight(0x808080);
        directionalLight.position.x = Math.random() - 0.5;
        directionalLight.position.y = Math.random() - 0.5;
        directionalLight.position.z = Math.random() - 0.5;
        directionalLight.position.normalize();
        scene.add(directionalLight);
        // Lights 

        var divCanvas = document.getElementById("canvas");
        renderer = new THREE.CanvasRenderer();
        renderer.setSize(divCanvas.offsetWidth, divCanvas.offsetHeight - 28);
        divCanvas.appendChild(renderer.domElement);


        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mousedown', onDocumentMouseDown, false);
        document.addEventListener('keydown', onDocumentKeyDown, false);
        document.addEventListener('keyup', onDocumentKeyUp, false);
        window.addEventListener('resize', onWindowResize, false);
    }

    function addPlane() {

        // Grid
        var size = cubeLength * 10,
            step = cubeLength;

        var geometry = new THREE.Geometry();

        for (var i = -size; i <= size; i += step) {

            geometry.vertices.push(new THREE.Vector3(-size, 0, i));
            geometry.vertices.push(new THREE.Vector3(size, 0, i));

            geometry.vertices.push(new THREE.Vector3(i, 0, -size));
            geometry.vertices.push(new THREE.Vector3(i, 0, size));

        }

        var material = new THREE.LineBasicMaterial({
            color: 0x000000,
            opacity: 0.2
        });

        var line = new THREE.Line(geometry, material);
        line.type = THREE.LinePieces;
        scene.add(line);

        //

        projector = new THREE.Projector();
        plane = new THREE.Mesh(new THREE.PlaneGeometry(cubeLength * 10 * 2, cubeLength * 10 * 2), new THREE.MeshBasicMaterial());
        plane.rotation.x = -Math.PI / 2;
        plane.visible = false;
        scene.add(plane);

        mouse2D = new THREE.Vector3(0, cubeLength * 10 * 2, 0.5);
        ray = new THREE.Ray(camera.position, null);
    }

    function buttonEvent() {
        if (isStart === true) {
            if (isPause) {
                isPause = false;
                document.getElementById("clean").innerHTML = 'Duraklat';
                buildStructure();
            } else {
                isPause = true;
                document.getElementById("clean").innerHTML = 'Devam Et';
            }
        } else {
            for (var i = scene.children.length - 1; i >= 0; i--) {
                if (scene.children[i].geometry instanceof THREE.CubeGeometry) {
                    scene.remove(scene.children[i]);
                } else if (scene.children[i].geometry instanceof THREE.PlaneGeometry || scene.children[i].geometry instanceof THREE.Geometry) {
                    scene.remove(scene.children[i]);
                }
            }
            cubeLength = settings.cubeLength;
            addPlane();
            document.getElementById("iteration").value = settings.iteration;
            document.getElementById("cubeLength").value = settings.cubeLength / 10;
            objects = [];
            structurePosition = {};
            isLock = false;
        }
    }

    function setValues() {
        settings.iteration = document.getElementById("iteration").value;
        settings.interval = document.getElementById("interval").value;
        document.getElementById("clean").innerHTML = 'Duraklat';
        isStart = true;
    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function onDocumentMouseMove(event) {

        event.preventDefault();

        mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse2D.y = -(event.clientY / window.innerHeight) * 2 + 1;

        mouse3D = projector.unprojectVector(mouse2D.clone(), camera);
        ray.direction = mouse3D.subSelf(camera.position).normalize();

        var intersects = ray.intersectObjects(scene.children);

        if (intersects.length > 0) {

            if (ROLLOVERED)
                ROLLOVERED.color.setHex(oldColor);

            ROLLOVERED = intersects[0].face;
            oldColor = ROLLOVERED.color.getHex();
            ROLLOVERED.color.setHex(settings.palette.select)
        }
    }

    function onDocumentMouseDown(event) {
        //event.preventDefault();
        var intersects = ray.intersectObjects(scene.children);

        if (intersects.length > 0) {

            if (isCtrlDown) {
                if (intersects[0].object != plane) {
                    scene.remove(intersects[0].object);
                }
            } else {
                if (!isLock) {
                    setValues();
                    _iteration = settings.iteration - 1;
                    isLock = true;
                    var position = new THREE.Vector3().add(intersects[0].point, intersects[0].object.matrixRotationWorld.multiplyVector3(
                        intersects[0].face.normal.clone()));
                    var geometry = new THREE.CubeGeometry(cubeLength, cubeLength, cubeLength);

                    var material = new THREE.MeshBasicMaterial({
                        wireframe: true
                    });
                    material.color = new THREE.Color().setHex(settings.palette.core);

                    var voxel = new THREE.Mesh(geometry, material);
                    voxel.position.x = Math.floor(position.x / cubeLength) * cubeLength + cubeLength / 2;
                    voxel.position.y = Math.floor(position.y / cubeLength) * cubeLength + cubeLength / 2;
                    voxel.position.z = Math.floor(position.z / cubeLength) * cubeLength + cubeLength / 2;

                    var startPoint = {
                        x: voxel.position.x,
                        y: voxel.position.y,
                        z: voxel.position.z,
                    };

                    voxel.matrixAutoUpdate = false;
                    voxel.updateMatrix();
                    scene.add(voxel);
                    newObject(startPoint.x, startPoint.y, startPoint.z);
                    buildStructure();
                }
            }
        }
    }

    function onDocumentKeyDown(event) {
        switch (event.keyCode) {
            case 17:
                isCtrlDown = true;
                break;
        }
    }

    function onDocumentKeyUp(event) {
        switch (event.keyCode) {
            case 17:
                isCtrlDown = false;
                break;
        }
    }

    function save() {
        window.open(renderer.domElement.toDataURL('image/png'), 'mywindow');
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        render();
    }

    function render() {
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }

    function disableControls() {
        controls.userRotate = false;
    }

    function enableControls() {
        controls.userRotate = true;
    }


    function createSideBar() {

        var sidebarDiv = document.getElementById("sidebar");
        sidebarDiv.className = "sidebar";
        var divCanvas = document.getElementById("canvas");
        divCanvas.className = "pad";

        //fill window
        var windowHeight = window.innerHeight;

        var divCanvasWidth = 98.5;
        var divCanvasHeight = windowHeight - 28;

        //set sidebar and pad sizes and store in 
        divCanvas.setAttribute("style", "width:" + divCanvasWidth + "%;height:" + divCanvasHeight + "px;background:white");
        sidebarDiv.setAttribute("style", "min-height:" + divCanvasHeight + "px;");

        var e = document.createElement("SPAN");
        e.className = "title";
        e.innerHTML = "Autopoiesis";
        e.innerHTML += '<span class="n">ITU</span>';
        sidebarDiv.appendChild(e);

        e = document.createElement("DIV");
        e.className = "divSeparator";
        sidebarDiv.appendChild(e);

        // ITERASYON
        e = document.createElement("BR");
        sidebarDiv.appendChild(e);

        e = document.createElement("SPAN");
        e.className = "letterLabel";
        e.innerHTML = "İterasyon";
        sidebarDiv.appendChild(e);

        e = document.createElement("INPUT");
        e.className = "number";
        e.setAttribute("type", "text");
        e.setAttribute("value", settings.iteration);
        e.setAttribute("id", "iteration");
        sidebarDiv.appendChild(e);

        e = document.createElement("DIV");
        e.className = "divSeparator";
        sidebarDiv.appendChild(e);


        // INTERVAL
        e = document.createElement("BR");
        sidebarDiv.appendChild(e);

        e = document.createElement("SPAN");
        e.className = "letterLabel";
        e.innerHTML = "Hız";
        e.innerHTML += '<span class="m"> (ms)</span>';
        sidebarDiv.appendChild(e);

        e = document.createElement("INPUT");
        e.className = "number";
        e.setAttribute("type", "text");
        e.setAttribute("value", settings.interval);
        e.setAttribute("id", "interval");
        sidebarDiv.appendChild(e);

        e = document.createElement("DIV");
        e.className = "divSeparator";
        sidebarDiv.appendChild(e);

        // Cube Length
        e = document.createElement("BR");
        sidebarDiv.appendChild(e);

        e = document.createElement("SPAN");
        e.className = "letterLabel";
        e.innerHTML = "Boyut";
        e.innerHTML += '<span class="m"> (Br)</span>';
        sidebarDiv.appendChild(e);

        e = document.createElement("INPUT");
        e.className = "number";
        e.setAttribute("type", "number");
        e.setAttribute("value", settings.cubeLength / 10);
        e.setAttribute("id", "cubeLength");
        e.addEventListener('change', cubeLengthControl);
        sidebarDiv.appendChild(e);

        e = document.createElement("DIV");
        e.className = "divSeparator";
        sidebarDiv.appendChild(e);

        // BLOCK PERCENTAGE
        e = document.createElement("BR");
        sidebarDiv.appendChild(e);

        e = document.createElement("SPAN");
        e.className = "letterLabel";
        e.innerHTML = "Blok";
        e.innerHTML += '<span class="m"> (%)</span>';
        sidebarDiv.appendChild(e);

        e = document.createElement("INPUT");
        e.className = "number";
        e.setAttribute("type", "number");
        e.setAttribute("value", settings.percentage.block);
        e.setAttribute("id", "blok");
        e.addEventListener('change', percentageControl);
        sidebarDiv.appendChild(e);

        e = document.createElement("DIV");
        e.className = "divSeparator";
        sidebarDiv.appendChild(e);

        // CORE PERCENTAGE
        e = document.createElement("BR");
        sidebarDiv.appendChild(e);

        e = document.createElement("SPAN");
        e.className = "letterLabel";
        e.innerHTML = "Çekirdek";
        e.innerHTML += '<span class="m"> (%)</span>';
        sidebarDiv.appendChild(e);

        e = document.createElement("INPUT");
        e.className = "number";
        e.setAttribute("type", "number");
        e.setAttribute("value", settings.percentage.core);
        e.setAttribute("id", "core");
        e.addEventListener('change', percentageControl);
        sidebarDiv.appendChild(e);


        e = document.createElement("DIV");
        e.className = "divSeparator";
        sidebarDiv.appendChild(e);

        // PALETTE

        e = document.createElement("SPAN");
        e.className = "letterLabel";
        e.innerHTML = "Palet";
        sidebarDiv.appendChild(e);

        e = document.createElement("DIV");
        e.className = "divSeparator";
        sidebarDiv.appendChild(e);

        var button = makeButton("auto", "small", "Auto", false);
        var image = makeImage("auto", "edit", "img/p3.PNG");
        button.appendChild(image);
        sidebarDiv.appendChild(button);
        button.addEventListener("click", () => {
            settings.palette = constants.palette.auto;
        });

        var button = makeButton("muzaffer", "small", "Muzaffer", false);
        var image = makeImage("muzaffer", "edit", "img/p1.PNG");
        button.appendChild(image);
        sidebarDiv.appendChild(button);
        button.addEventListener("click", () => {
            settings.palette = constants.palette.muzaffer;
        });

        button = makeButton("rusen", "small", "Rusen", false);
        image = makeImage("muzaffer", "edit", "img/p2.PNG");
        button.appendChild(image);
        sidebarDiv.appendChild(button);
        button.addEventListener("click", () => {
            settings.palette = constants.palette.rusen;
        });

        // CLEAN BUTTON
        e = document.createElement("DIV");
        e.className = "divSeparator";
        sidebarDiv.appendChild(e);

        var button = makeButton("clean", "clean", false, "Temizle");
        sidebarDiv.appendChild(button);
        button.addEventListener("click", buttonEvent);

        sidebarDiv.addEventListener('mousedown', disableControls, false);
        sidebarDiv.addEventListener('mouseup', enableControls, false);
    }

    function makeButton(id, className, title, text) {
        var button = document.createElement("BUTTON");
        if (className) {
            button.setAttribute("class", className);
        }
        if (id) {
            button.setAttribute("id", id);
        }
        if (title) {
            button.setAttribute("title", title);
        }
        if (text) {
            button.innerHTML = text;
        }
        return button;
    }

    function makeImage(id, className, src) {
        var i = document.createElement("IMG");
        if (className) {
            i.setAttribute("class", className);
        }
        if (id) {
            i.setAttribute("id", id);
        }
        if (src) {
            i.setAttribute("src", src);
        }
        return i;
    }

    function percentageControl(event) {
        var blockPercentage = document.getElementById("blok").value;
        var corePercentage = document.getElementById("core").value;

        if (blockPercentage < 20 || blockPercentage > 80) {
            document.getElementById("blok").value = settings.percentage.block;
            return;
        }

        if (corePercentage < 20 || corePercentage > 80) {
            document.getElementById("core").value = settings.percentage.core;
            return;
        }

        if (event.target.id === "blok") {
            settings.percentage.block = document.getElementById("blok").value;
            settings.percentage.core = 100 - settings.percentage.block;
            document.getElementById("core").value = settings.percentage.core;
        } else {
            settings.percentage.core = document.getElementById("core").value;
            settings.percentage.block = 100 - settings.percentage.core;
            document.getElementById("blok").value = settings.percentage.block;
        }
    }

    function cubeLengthControl() {
        if (isStart || isLock) {
            return;
        }

        value = document.getElementById("cubeLength").value * 10;

        if (value < 0 || value > 100) {
            value = settings.cubeLength;
            document.getElementById("cubeLength").value = value / 10;
        }

        for (var i = scene.children.length - 1; i >= 0; i--) {
            if (scene.children[i].geometry instanceof THREE.PlaneGeometry || scene.children[i].geometry instanceof THREE.Geometry) {
                scene.remove(scene.children[i]);
            }
        }
        settings.cubeLength = value;
        cubeLength = value;
        addPlane();
    }
})();
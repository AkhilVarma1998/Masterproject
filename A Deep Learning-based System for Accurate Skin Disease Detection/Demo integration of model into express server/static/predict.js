$(document).ready(function() {
    $("#image-selector").change(function() {
        let reader = new FileReader();
        reader.onload = function() {
            let dataurl = reader.result;
            $('#selected-image').attr("src", dataurl);
            // console.log(dataurl);
            $('#predicted-list').empty();
        }
        let file = $('#image-selector').prop('files')[0];
        reader.readAsDataURL(file);
    });
    let model;
    (async function() {
        console.log("loading_model");
        model = await tf.loadLayersModel('http://127.0.0.1:8100/mobilenet_model/model.json');
        $('.progress-bar').hide();
        console.log("loaded");
    })();

    // $("#prebut").click(function(e) {
    //     console.log("It works");
    // })

    // $('#prebut').click(function(e) {
    //     // $('body').addClass('bgimg');
    //     console.log("It workss")
    // });

    // $(document).ready(function() {
    // $('#prebut').click(function(e) {
    //     // $('body').addClass('bgimg');
    //     console.log("It workss")
    // });




    $("#prebut").click(async function() {
        console.log("clicked");
        let image = $("#selected-image").get(0);
        // let tensor = tf.fromPixels(image)
        let tensor = tf.browser.fromPixels(image);

        tensor = tf.image.resizeBilinear(tensor, [120, 120]);
        tensor = tf.expandDims(tensor, 0);
        console.log(tensor);
        // tensor = tf.tensor3d(tensor, 'float32');
        // .toFloatArray().expandDims();
        // tf.browser.fromPixels(image)


        // console.log("Got image" + string(tensor));

        const skin_class = {
            0: 'Acne and Rosacea Photos',
            1: 'Actinic Keratosis Basal Cell Carcinoma and other Malignant Lesions',
            2: 'Atopic Dermatitis Photos',
            3: 'Bullous Disease Photos',
            4: 'Cellulitis Impetigo and other Bacterial Infections',
            5: 'Eczema Photos',
            6: 'Exanthems and Drug Eruptions',
            7: 'Hair Loss Photos Alopecia and other Hair Diseases',
            8: 'Herpes HPV and other STDs Photos',
            9: 'Light Diseases and Disorders of Pigmentation',
            10: 'Lupus and other Connective Tissue diseases',
            11: 'Melanoma Skin Cancer Nevi and Moles',
            12: 'Nail Fungus and other Nail Disease',
            13: 'Poison Ivy Photos and other Contact Dermatitis',
            14: 'Psoriasis pictures Lichen Planus and related diseases',
            15: 'Scabies Lyme Disease and other Infestations and Bites',
            16: 'Seborrheic Keratoses and other Benign Tumors',
            17: 'Systemic Disease',
            18: 'Tinea Ringworm Candidiasis and other Fungal Infections',
            19: 'Urticaria Hives',
            20: 'Vascular Tumors',
            21: 'Vasculitis Photos',
            22: 'Warts Molluscum and other Viral Infections'

        };



        let predictions = await model.predict(tensor).data();

        let top = Array.from(predictions)
            .map(function(p, i) {
                return {
                    probability: p,
                    class: skin_class[i]
                };

            }).sort(function(a, b) {
                return b.probability - a.probability;
            }).slice(0, 5);

        // console.log(top);

        // top = predictions.argmax()
        const x = tf.tensor1d(predictions);
        x.argMax().print();
        // console.log(predictions);
        $("#prediction-list").empty();
        top.forEach(function(p) {
            console.log(p, "pred");
            $('#prediction-list').append(`<p>${p.class}: ${p.probability.toFixed(6)}</p>`);
        });

    });
});
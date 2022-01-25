<template>
  <div class="fluid-container flex-grow-1 justify-content-center align-items-center d-flex">
    <form method="get" action="#" enctype="multipart/form-data" class="p-2" @submit="onFormSubmit">
      <div v-if="formSuccess===true" class="alert alert-success">
        <strong>Успех!</strong> Логи загружены в базу данных
      </div>
      <div v-if="formSuccess===false" class="alert alert-danger">
        <strong>Ошибка!</strong> Что-то пошло не так
      </div>
      <div class="form-group mb-3">
        <label class="form-label" for="file">Выберите XML файл с логами</label>
        <input class="form-control" type="file" id="file" name="file" accept=".xml" @change="(e)=>{
  file = e.target.files[0] || null;
}"/>
      </div>
      <button type="submit" class="btn btn-primary"><span v-if="formLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"> </span>Отправить</button>
    </form>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { ref } from 'vue';
import axios from 'axios';
import { parseJSONFromString } from '@/utils';

export default {
  name: "UploadFile",
  setup() {
    const store = useStore()
    const file = ref(null)
    const formLoading = ref(false)
    const formSuccess = ref(null)
    const onFormSubmit = (event) => {
      event.preventDefault();
      let bodyFormData = new FormData();
      bodyFormData.append('file', file.value);
      formLoading.value = true
      let requestUrl = store.state.existAppUrl+"upload.xq"
      axios({
        method: "POST",
        url: requestUrl,
        headers: {'Content-Type': 'multipart/form-data'},
        data: bodyFormData
      })
      .then((result)=>{
        let response = parseJSONFromString(result.data)
        if (response.result !== "success"){
          console.error("Error occurred while uploading file")
          formSuccess.value = false;
          return
        }
        formSuccess.value = true;
        console.log("ok")
      })
      .catch((error)=>{
        formSuccess.value = false;
        console.log(error)
      })
      .finally(()=>{
        formLoading.value = false;
      })
    }

    return {
      onFormSubmit,
      file,
      formLoading,
      formSuccess
    }
  }
}
</script>

<style scoped lang="scss">
form {
  border: 3px solid #666;
  border-radius: 8px;

  box-shadow: 0 0 10px #666;

  transition: 0.12s;
}
form:hover {
  box-shadow: 0 0 17px #666;
  transform: scale(1.02);
}
</style>

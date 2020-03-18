<template>
    <entrance :types="'password'"></entrance>
</template>
<script>
import Entrance from '../../components/Entrance';
export default {
    name: 'login-password',
    components: {
        Entrance
    },
    data() {
        return {

        }
    },
}
</script>
<style lang="scss" scoped>
@import '../../common/styles/defin';
entrance{
	width: 100%;
}
</style>


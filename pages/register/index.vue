<template>
	<entrance :types="'register'" class="entrance-box"></entrance>
</template>
<script>
import Entrance from '../../components/Entrance';
export default {
    name: 'register',
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
.entrance-box{
	width: 100%;
}
</style>


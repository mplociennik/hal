<?php

namespace AppBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ConversationControllerControllerTest extends WebTestCase
{
    public function testConversationpost()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/conversation');
    }

    public function testConversationget()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/conversation/{id}');
    }

    public function testConversationtreeget()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/conversation-tree/{id}');
    }

    public function testConversationpatch()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/conversation/{id}');
    }

}
